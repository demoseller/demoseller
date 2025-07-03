
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

    // Convert file to FormData for Cloudinary
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', 'ml_default') // Use unsigned upload preset
    uploadFormData.append('folder', 'product-images')

    console.log('Uploading to Cloudinary...')

    // Upload to Cloudinary using unsigned upload
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    console.log('Cloudinary response status:', uploadResponse.status)

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Cloudinary upload failed:', errorText)
      
      // Try with signed upload as fallback
      console.log('Trying signed upload as fallback...')
      
      // Generate timestamp and signature
      const timestamp = Math.round(Date.now() / 1000)
      const paramsToSign = `folder=product-images&timestamp=${timestamp}`
      
      // Create signature
      const encoder = new TextEncoder()
      const data = encoder.encode(paramsToSign + apiSecret)
      const hashBuffer = await crypto.subtle.digest('SHA-1', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Prepare signed upload
      const signedFormData = new FormData()
      signedFormData.append('file', file)
      signedFormData.append('api_key', apiKey)
      signedFormData.append('timestamp', timestamp.toString())
      signedFormData.append('signature', signature)
      signedFormData.append('folder', 'product-images')

      const signedResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: signedFormData,
        }
      )

      if (!signedResponse.ok) {
        const signedErrorText = await signedResponse.text()
        console.error('Signed upload also failed:', signedErrorText)
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to upload image to Cloudinary',
            details: signedErrorText
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      const signedResult = await signedResponse.json()
      console.log('Signed upload successful:', { 
        public_id: signedResult.public_id, 
        url: signedResult.secure_url 
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: signedResult.secure_url,
          publicId: signedResult.public_id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const uploadResult = await uploadResponse.json()
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
