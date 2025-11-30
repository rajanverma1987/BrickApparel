'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import connectDB from '../lib/db/mongoose'
import cartService from '../domain/services/CartService'
import orderService from '../domain/services/OrderService'
import paymentService from '../domain/services/PaymentService'
import emailService from '../domain/services/EmailService'
import { generateSessionId } from '../lib/auth/session'

export async function createOrderAction(formData) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return { success: false, error: 'Session not found' }
    }

    const cart = await cartService.getCart(sessionId)
    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    const shippingAddress = {
      firstName: formData.get('shippingFirstName'),
      lastName: formData.get('shippingLastName'),
      addressLine1: formData.get('shippingAddress1'),
      addressLine2: formData.get('shippingAddress2'),
      city: formData.get('shippingCity'),
      state: formData.get('shippingState'),
      zipCode: formData.get('shippingZip'),
      country: formData.get('shippingCountry') || 'US',
      phone: formData.get('shippingPhone'),
    }

    const billingAddress = {
      firstName: formData.get('billingFirstName') || shippingAddress.firstName,
      lastName: formData.get('billingLastName') || shippingAddress.lastName,
      addressLine1: formData.get('billingAddress1') || shippingAddress.addressLine1,
      addressLine2: formData.get('billingAddress2') || shippingAddress.addressLine2,
      city: formData.get('billingCity') || shippingAddress.city,
      state: formData.get('billingState') || shippingAddress.state,
      zipCode: formData.get('billingZip') || shippingAddress.zipCode,
      country: formData.get('billingCountry') || shippingAddress.country,
      phone: formData.get('billingPhone') || shippingAddress.phone,
    }

    const guestEmail = formData.get('email')
    const paymentMethod = formData.get('paymentMethod')

    // Create order
    const order = await orderService.createOrder(
      cart,
      shippingAddress,
      billingAddress,
      null, // customerId - would be set if logged in
      guestEmail
    )

    // Send emails
    try {
      await emailService.sendOrderConfirmation(order, guestEmail)
      await emailService.sendOrderAlert(order)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the order if email fails
    }

    // Create payment intent/order
    let paymentResult = null
    if (paymentMethod === 'stripe') {
      paymentResult = await paymentService.createStripePaymentIntent(
        order._id.toString(),
        order.total,
        'usd'
      )
    } else if (paymentMethod === 'paypal') {
      paymentResult = await paymentService.createPayPalOrder(
        order._id.toString(),
        order.total,
        'USD'
      )
    }

    // Clear cart
    await cartService.clearCart(sessionId)

    return {
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      paymentMethod,
      paymentResult,
      redirectUrl: paymentMethod === 'paypal' && paymentResult?.approvalUrl 
        ? paymentResult.approvalUrl 
        : `/order-success/${order._id}`,
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

