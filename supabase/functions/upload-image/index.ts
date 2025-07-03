
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Upload request received:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Cloudinary credentials from environment
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    console.log('Cloudinary config check:', { 
      hasCloudName: !!cloudName, 
      hasApiKey: !!apiKey, 
      hasApiSecret: !!apiSecret 
    })

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Cloudinary credentials not configured properly. Please check your environment variables.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file provided in request')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No file provided in request' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('File received:', { name: file.name, type: file.type, size: file.size })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid file type. Please upload an image file.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'File size too large. Please upload an image smaller than 10MB.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const dataURI = `data:${file.type};base64,${base64String}`

    console.log('File converted to base64, size:', base64String.length)

    // Generate timestamp for Cloudinary signature
    const timestamp = Math.round(Date.now() / 1000)
    
    // Create the string to sign (alphabetically ordered parameters)
    const paramsToSign = `folder=product-images&timestamp=${timestamp}`
    
    // Create signature using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(paramsToSign + apiSecret)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    console.log('Generated signature for timestamp:', timestamp)

    // Prepare form data for Cloudinary upload
    const uploadFormData = new FormData()
    uploadFormData.append('file', dataURI)
    uploadFormData.append('api_key', apiKey)
    uploadFormData.append('timestamp', timestamp.toString())
    uploadFormData.append('signature', signature)
    uploadFormData.append('folder', 'product-images')

    console.log('Uploading to Cloudinary...')

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    console.log('Cloudinary response status:', uploadResponse.status)
    const responseText = await uploadResponse.text()
    console.log('Cloudinary response:', responseText)

    if (!uploadResponse.ok) {
      console.error('Cloudinary upload failed:', responseText)
      
      let errorMessage = 'Failed to upload image to Cloudinary'
      try {
        const errorData = JSON.parse(responseText)
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message
        }
      } catch (e) {
        console.log('Could not parse error response as JSON')
      }

      return new Response(
        JSON.stringify({ 
          success: false,
          error: errorMessage,
          details: responseText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const uploadResult = JSON.parse(responseText)
    console.log('Upload successful:', { 
      public_id: uploadResult.public_id, 
      url: uploadResult.secure_url 
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error occurred during upload',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
