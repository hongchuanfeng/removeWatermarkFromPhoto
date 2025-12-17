import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, metadata } = body

    const response = await axios.post(
      `${process.env.CREEM_API_URL || 'https://api.creem.io'}/v1/checkouts`,
      {
        product_id,
        metadata,
      },
      {
        headers: {
          'x-api-key': process.env.CREEM_API_KEY || '',
        },
      }
    )

    return NextResponse.json({ url: response.data.url })
  } catch (error: any) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create checkout' },
      { status: 500 }
    )
  }
}
