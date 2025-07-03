
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
        JSON.stringify({ error: 'Cloudinary credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file provided in request')
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('File received:', { name: file.name, type: file.type, size: file.size })

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const dataURI = `data:${file.type};base64,${base64String}`

    console.log('File converted to base64, length:', base64String.length)

    // Generate timestamp and signature for Cloudinary
    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = `folder=product-images&timestamp=${timestamp}`
    
    // Create signature using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(paramsToSign + apiSecret)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    console.log('Signature generated for timestamp:', timestamp)

    // Upload to Cloudinary
    const uploadFormData = new FormData()
    uploadFormData.append('file', dataURI)
    uploadFormData.append('api_key', apiKey)
    uploadFormData.append('timestamp', timestamp.toString())
    uploadFormData.append('signature', signature)
    uploadFormData.append('folder', 'product-images')

    console.log('Uploading to Cloudinary...')

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
      console.error('Cloudinary upload error:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to upload image to Cloudinary',
          details: errorText,
          status: uploadResponse.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const uploadResult = await uploadResponse.json()
    console.log('Upload successful:', { public_id: uploadResult.public_id, url: uploadResult.secure_url })

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
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
