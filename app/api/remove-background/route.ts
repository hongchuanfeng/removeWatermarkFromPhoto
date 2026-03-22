import { NextRequest, NextResponse } from 'next/server'
import COS from 'cos-nodejs-sdk-v5'
import crypto from 'crypto'
import { supabaseClient } from '@/lib/supabase'

const SECRET_ID = process.env.TENCENT_SECRET_ID!
const SECRET_KEY = process.env.TENCENT_SECRET_KEY!
const REGION = process.env.TENCENT_COS_REGION!
const BUCKET = process.env.TENCENT_COS_BUCKET!

const cos = new COS({
  SecretId: SECRET_ID,
  SecretKey: SECRET_KEY,
})

function uploadToCOS(key: string, data: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
      Body: data,
      ContentType: 'image/jpeg',
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function callTencentBackgroundRemovalAPI(inputKey: string): Promise<{ ResultImage: string }> {
  const queryString = 'ci-process=SegmentMe'

  return new Promise<{ ResultImage: string }>((resolve, reject) => {
    const getObjectUrlParams = {
      Bucket: BUCKET,
      Region: REGION,
      Key: inputKey,
      Sign: true,
      QueryString: queryString,
      Expires: 600,
    }

    cos.getObjectUrl(getObjectUrlParams, async (err, data) => {
      if (err) {
        console.error('COS getObjectUrl error:', err)
        reject(new Error(`Failed to get signed URL: ${err.message}`))
        return
      }

      const signedUrl = data.Url
      console.log('Generated signed URL:', signedUrl)

      try {
        const response = await fetch(signedUrl)

        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Response error text:', errorText)
          throw new Error(`Tencent API request failed: ${response.status} ${response.statusText} - ${errorText}`)
        }

        // 腾讯云数据万象返回XML格式
        const xmlResponse = await response.text()
        console.log('Raw XML response (first 500 chars):', xmlResponse.substring(0, 500))

        // 解析XML响应，提取Base64图片数据
        const base64Match = xmlResponse.match(/<ResultImage>([^<]+)<\/ResultImage>/)
        if (!base64Match) {
          console.error('No ResultImage found in XML response')
          // 尝试其他可能的响应格式
          const outputUrlMatch = xmlResponse.match(/<OutputUrl>([^<]+)<\/OutputUrl>/)
          if (outputUrlMatch) {
            // 如果返回的是URL而不是Base64，需要下载图片
            const outputUrl = outputUrlMatch[1]
            console.log('Got output URL:', outputUrl)
            
            // 下载处理后的图片
            const imgResponse = await fetch(outputUrl)
            if (!imgResponse.ok) {
              throw new Error('Failed to download processed image')
            }
            const imgBuffer = await imgResponse.arrayBuffer()
            const base64 = Buffer.from(imgBuffer).toString('base64')
            resolve({ ResultImage: base64 })
            return
          }
          throw new Error('Invalid response format: no ResultImage or OutputUrl found')
        }

        const base64Data = base64Match[1]
        console.log('Extracted base64 data (first 100 chars):', base64Data.substring(0, 100))

        resolve({
          ResultImage: base64Data,
        })

      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        reject(fetchError)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    console.log('=== Remove Background API Request ===')
    console.log('Request body:', requestBody)

    const { imageUrl, userId } = requestBody

    if (!imageUrl || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: imageUrl and userId' },
        { status: 400 }
      )
    }

    console.log('Request parameters:', {
      imageUrl: imageUrl.substring(0, 100) + '...',
      userId
    })

    // 检查用户积分
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // 下载原始图片
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download image')
    }
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageData = Buffer.from(imageBuffer)

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = crypto.randomBytes(8).toString('hex')
    const inputKey = `remove-background/input/${timestamp}_${randomStr}.jpg`

    // 上传原始图片到COS
    await uploadToCOS(inputKey, imageData)

    // 调用腾讯云AI背景抠图API
    console.log('Calling Tencent Background Removal API...')
    const result = await callTencentBackgroundRemovalAPI(inputKey)
    console.log('Tencent API call completed')

    if (!result || !result.ResultImage) {
      throw new Error('Background removal processing failed')
    }

    // 只有在处理成功后才扣除积分
    console.log('Processing successful, deducting credits...')
    const { error: updateError } = await supabaseClient
      .from('users')
      .update({ credits: userData.credits - 1 })
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to deduct credits after successful processing:', updateError)
    } else {
      // 记录积分历史
      await supabaseClient
        .from('credit_history')
        .insert({
          user_id: userId,
          amount: -1,
          type: 'spent',
          description: 'AI Background Removal processing'
        })
    }

    const finalImageData = `data:image/png;base64,${result.ResultImage}`
    console.log('Final image data length:', result.ResultImage.length)

    return NextResponse.json({
      success: true,
      resultImage: finalImageData,
      message: 'Background removal completed successfully'
    })

  } catch (error) {
    console.error('Remove Background API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to remove background',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
