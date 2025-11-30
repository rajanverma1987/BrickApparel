import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`)
  }
}

export async function retrievePaymentIntent(intentId) {
  try {
    return await stripe.paymentIntents.retrieve(intentId)
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`)
  }
}

export async function capturePaymentIntent(intentId) {
  try {
    return await stripe.paymentIntents.capture(intentId)
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`)
  }
}

export async function createRefund(intentId, amount = null) {
  try {
    const refundData = { payment_intent: intentId }
    if (amount) {
      refundData.amount = Math.round(amount * 100)
    }
    return await stripe.refunds.create(refundData)
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`)
  }
}

export function constructWebhookEvent(payload, signature, secret) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

export default stripe

