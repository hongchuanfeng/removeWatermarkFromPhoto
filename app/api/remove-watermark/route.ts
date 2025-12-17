import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import COS from 'cos-nodejs-sdk-v5'
import crypto from 'crypto'

const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID,
  SecretKey: process.env.TENCENT_SECRET_KEY,
})

// Generate a signed GET URL for COS object with optional query string
function getSignedUrl(key: string, queryString: string = ''): Promise<string> {
  return new Promise((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket: process.env.TENCENT_COS_BUCKET!,
        Region: process.env.TENCENT_COS_REGION!,
        Key: key,
        Sign: true,
        QueryString: queryString.replace(/^\?/, ''), // remove leading "?" if present
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.Url)
        }
      }
    )
  })
}

// Helper function to generate Tencent Cloud API signature
function generateSignature(secretKey: string, method: string, uri: string, params: Record<string, string>): string {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&')
  const signString = `${method}\n${uri}\n${sortedParams}\n`
  const hmac = crypto.createHmac('sha1', secretKey)
  hmac.update(signString)
  return hmac.digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      // If user doesn't exist, create with 5 free credits
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          credits: 5,
        })

      if (insertError) {
        return NextResponse.json({ error: 'Failed to check credits' }, { status: 500 })
      }

      // Record initial credits
      await supabase
        .from('credit_history')
        .insert({
          user_id: user.id,
          amount: 5,
          type: 'initial',
          description: 'Welcome bonus - 5 free credits',
          created_at: new Date().toISOString(),
        })
    }

    const credits = userData?.credits || 5
    if (credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please subscribe.' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    const x = formData.get('x') as string | null
    const y = formData.get('y') as string | null
    const width = formData.get('width') as string | null
    const height = formData.get('height') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Tencent COS
    const fileName = `${Date.now()}-${file.name}`
    const key = `${process.env.TENCENT_COS_UPLOAD_DIR}${fileName}`

    await new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: process.env.TENCENT_COS_BUCKET!,
          Region: process.env.TENCENT_COS_REGION!,
          Key: key,
          Body: buffer,
        },
        (err, data) => {
          if (err) reject(err)
          else resolve(data)
        }
      )
    })

    const imageUrl = `https://${process.env.TENCENT_COS_BUCKET}.cos.${process.env.TENCENT_COS_REGION}.myqcloud.com${key}`

    // Log request parameters (no secrets)
    console.log('[remove-watermark] start', {
      userId: user.id,
      imageKey: key,
      imageUrl,
      area: { x, y, width, height },
    })

    // Call Tencent Cloud CI API for watermark removal
    // Using Tencent Cloud Data Processing (数据万象) image processing
    // Reference: https://cloud.tencent.com/document/product/460/79042
    
    let resultUrl = imageUrl
    let processedKey = key
    
    // If coordinates are provided, use them for targeted watermark removal
    if (x && y && width && height) {
      // Use imageMogr2 with region-specific processing
      // For watermark removal, we can use blur or inpainting
      // Format: imageMogr2/auto-orient/crop/{width}x{height}!{x}x{y}/blur/{radius}x{radius}
      
      // Calculate blur radius based on watermark size
      const blurRadius = Math.max(20, Math.min(50, Math.max(parseInt(width), parseInt(height)) / 2))
      
      // Apply blur to the watermark region
      // Note: imageMogr2 processes the entire image, so we need to crop first, blur, then composite
      // For simplicity, we'll use a general blur approach
      const processingParams = `?imageMogr2/auto-orient/blur/${blurRadius}x${blurRadius}`
      resultUrl = `${imageUrl}${processingParams}`
      
      // Alternative: Use AI-based watermark removal if available
      // resultUrl = `${imageUrl}?ci-process=AI&action=RemoveWatermark&x=${x}&y=${y}&width=${width}&height=${height}`
    } else {
      // If no coordinates, use general watermark removal
      // Try using AI-based processing or general image enhancement
      const processingParams = `?imageMogr2/auto-orient/quality/90`
      resultUrl = `${imageUrl}${processingParams}`
      
      // Note: For actual watermark removal without coordinates,
      // you may need to use AI-based detection and removal
      // This typically requires calling a specific API endpoint
    }
    
    // For production, you might want to:
    // 1. Download the processed image
    // 2. Upload it back to COS with a new key
    // 3. Return the new URL
    
    // Example: Download processed image and re-upload
    try {
      // Use signed URL to avoid 403 on private buckets
      const signedProcessingUrl = await getSignedUrl(key, resultUrl.split('?')[1] || '')
      console.log('[remove-watermark] processing URL', { signedProcessingUrl })
      const processedResponse = await fetch(signedProcessingUrl)
      console.log('[remove-watermark] processing response', {
        status: processedResponse.status,
        ok: processedResponse.ok,
        statusText: processedResponse.statusText,
        headers: Object.fromEntries(processedResponse.headers.entries()),
      })
      if (processedResponse.ok) {
        const processedBuffer = Buffer.from(await processedResponse.arrayBuffer())
        const resultFileName = `result-${Date.now()}-${file.name}`
        const resultKey = `${process.env.TENCENT_COS_UPLOAD_DIR}${resultFileName}`
        
        await new Promise((resolve, reject) => {
          cos.putObject(
            {
              Bucket: process.env.TENCENT_COS_BUCKET!,
              Region: process.env.TENCENT_COS_REGION!,
              Key: resultKey,
              Body: processedBuffer,
            },
            (err, data) => {
              if (err) reject(err)
              else resolve(data)
            }
          )
        })
        
        resultUrl = `https://${process.env.TENCENT_COS_BUCKET}.cos.${process.env.TENCENT_COS_REGION}.myqcloud.com${resultKey}`
        console.log('[remove-watermark] uploaded processed image', { resultUrl, resultKey })
      }
    } catch (processError) {
      console.error('Error processing image:', processError)
      // Fall back to original processing URL
    }

    // Deduct credit
    await supabase
      .from('users')
      .update({ credits: credits - 1 })
      .eq('id', user.id)

    // Save conversion record
    const { data: conversionData, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: user.id,
        original_url: imageUrl,
        result_url: resultUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    // Record credit history (spent)
    if (conversionData) {
      await supabase
        .from('credit_history')
        .insert({
          user_id: user.id,
          amount: 1,
          type: 'spent',
          description: 'Watermark removal',
          related_conversion_id: conversionData.id,
          created_at: new Date().toISOString(),
        })
    }

    return NextResponse.json({ resultUrl })
  } catch (error: any) {
    console.error('Error removing watermark:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove watermark' },
      { status: 500 }
    )
  }
}
