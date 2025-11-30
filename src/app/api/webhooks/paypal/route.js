import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db/mongoose'
import paymentService from '../../../../domain/services/PaymentService'
import { verifyWebhook } from '../../../../lib/payments/paypal'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const headers = Object.fromEntries(request.headers.entries())

    // Verify webhook (simplified - implement proper verification in production)
    const isValid = verifyWebhook(headers, body, process.env.PAYPAL_WEBHOOK_ID)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    await paymentService.handlePayPalWebhook(body)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

