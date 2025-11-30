import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db/mongoose'
import paymentService from '../../../../domain/services/PaymentService'
import { constructWebhookEvent } from '../../../../lib/payments/stripe'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    await paymentService.handleStripeWebhook(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

