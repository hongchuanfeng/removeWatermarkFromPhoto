import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import * as crypto from 'crypto'

function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('creem-signature')
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // Verify signature
    const secret = process.env.CREEM_WEBHOOK_SECRET || ''
    const computedSignature = generateSignature(rawBody, secret)

    if (signature !== computedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check if payment is completed
    let transactionId: string | null = null
    let userId: string | null = null
    let credits = 0

    if (body.eventType === 'subscription.paid') {
      transactionId = body.object.last_transaction_id
      userId = body.object.metadata?.internal_customer_id
      // Determine credits based on product
      const productId = body.object.product?.id
      if (productId === process.env.CREEM_PRODUCT_BASIC_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_ID) credits = 30
      else if (productId === process.env.CREEM_PRODUCT_STANDARD_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_STANDARD_ID) credits = 100
      else if (productId === process.env.CREEM_PRODUCT_PREMIUM_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_PREMIUM_ID) credits = 350
    } else if (body.eventType === 'checkout.completed' && body.object.order?.status === 'paid') {
      transactionId = body.object.order.transaction
      // Try multiple ways to get userId from metadata
      userId = body.object.metadata?.internal_customer_id 
        || body.object.customer?.metadata?.internal_customer_id
        || body.object.subscription?.metadata?.internal_customer_id
      // Determine credits based on product
      const productId = body.object.product?.id || body.object.order?.product
      if (productId === process.env.CREEM_PRODUCT_BASIC_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC_ID) credits = 30
      else if (productId === process.env.CREEM_PRODUCT_STANDARD_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_STANDARD_ID) credits = 100
      else if (productId === process.env.CREEM_PRODUCT_PREMIUM_ID || productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_PREMIUM_ID) credits = 350
    }

    if (!transactionId || !userId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Check if transaction already exists
    const { data: existingOrder } = await supabase
      .from('subscription_orders')
      .select('id')
      .eq('transaction_id', transactionId)
      .single()

    if (existingOrder) {
      return NextResponse.json({ message: 'Order already processed' })
    }

    // Get product_id from different possible locations
    const productId = body.object.product?.id || body.object.order?.product || body.object.subscription?.product

    // Add to subscription_orders
    const { data: orderData, error: orderError } = await supabase
      .from('subscription_orders')
      .insert({
        transaction_id: transactionId,
        user_id: userId,
        product_id: productId,
        amount: body.object.product?.price || body.object.order?.amount || 0,
        credits,
        status: 'completed',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error inserting order:', orderError)
    }

    // Update user credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    const currentCredits = userData?.credits || 0
    await supabase
      .from('users')
      .update({ credits: currentCredits + credits })
      .eq('id', userId)

    // Record credit history
    if (orderData) {
      await supabase
        .from('credit_history')
        .insert({
          user_id: userId,
          amount: credits,
          type: 'earned',
          description: `Subscription payment - ${credits} credits`,
          related_order_id: orderData.id,
          created_at: new Date().toISOString(),
        })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
