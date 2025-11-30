import paypal from '@paypal/checkout-server-sdk'

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const mode = process.env.PAYPAL_MODE || 'sandbox'

  if (mode === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret)
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

function client() {
  return new paypal.core.PayPalHttpClient(environment())
}

export async function createOrder(amount, currency = 'USD', metadata = {}) {
  try {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          custom_id: metadata.orderId || '',
        },
      ],
      application_context: {
        brand_name: 'Brick Apparel',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.APP_URL}/order-success`,
        cancel_url: `${process.env.APP_URL}/checkout`,
      },
    })

    const order = await client().execute(request)
    return order.result
  } catch (error) {
    throw new Error(`PayPal error: ${error.message}`)
  }
}

export async function captureOrder(orderId) {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    const capture = await client().execute(request)
    return capture.result
  } catch (error) {
    throw new Error(`PayPal error: ${error.message}`)
  }
}

export async function getOrder(orderId) {
  try {
    const request = new paypal.orders.OrdersGetRequest(orderId)
    const order = await client().execute(request)
    return order.result
  } catch (error) {
    throw new Error(`PayPal error: ${error.message}`)
  }
}

export async function refundOrder(captureId, amount = null, currency = 'USD') {
  try {
    const request = new paypal.payments.CapturesRefundRequest(captureId)
    
    if (amount) {
      request.requestBody({
        amount: {
          value: amount.toFixed(2),
          currency_code: currency,
        },
      })
    } else {
      request.requestBody({})
    }

    const refund = await client().execute(request)
    return refund.result
  } catch (error) {
    throw new Error(`PayPal error: ${error.message}`)
  }
}

export function verifyWebhook(headers, body, webhookId) {
  // PayPal webhook verification would go here
  // This is a simplified version - in production, use PayPal's webhook verification SDK
  return true
}

