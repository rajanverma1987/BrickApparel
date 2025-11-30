import * as stripeLib from '../../lib/payments/stripe'
import * as paypalLib from '../../lib/payments/paypal'
import transactionRepository from '../repositories/TransactionRepository'
import orderRepository from '../repositories/OrderRepository'
import orderService from './OrderService'

class PaymentService {
  async createStripePaymentIntent(orderId, amount, currency = 'usd') {
    const order = await orderRepository.findById(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    const paymentIntent = await stripeLib.createPaymentIntent(amount, currency, {
      orderId: orderId.toString(),
      orderNumber: order.orderNumber,
    })

    // Create transaction record
    const transaction = await transactionRepository.create({
      order: orderId,
      provider: 'stripe',
      transactionId: paymentIntent.id,
      intentId: paymentIntent.id,
      amount,
      currency,
      status: 'pending',
    })

    await orderRepository.addTransaction(orderId, transaction._id)

    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id,
      intentId: paymentIntent.id,
    }
  }

  async createPayPalOrder(orderId, amount, currency = 'USD') {
    const order = await orderRepository.findById(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    const paypalOrder = await paypalLib.createOrder(amount, currency, {
      orderId: orderId.toString(),
      orderNumber: order.orderNumber,
    })

    // Create transaction record
    const transaction = await transactionRepository.create({
      order: orderId,
      provider: 'paypal',
      transactionId: paypalOrder.id,
      intentId: paypalOrder.id,
      amount,
      currency,
      status: 'pending',
    })

    await orderRepository.addTransaction(orderId, transaction._id)

    return {
      orderId: paypalOrder.id,
      approvalUrl: paypalOrder.links.find((link) => link.rel === 'approve')?.href,
      transactionId: transaction._id,
    }
  }

  async handleStripeWebhook(event) {
    const transaction = await transactionRepository.findByTransactionId(event.data.object.id)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    // Record webhook event
    await transactionRepository.addWebhookEvent(transaction._id, {
      eventId: event.id,
      eventType: event.type,
      payload: event.data.object,
    })

    let paymentStatus = transaction.status

    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentStatus = 'captured'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'captured')
        break
      case 'payment_intent.payment_failed':
        paymentStatus = 'failed'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'failed')
        break
      case 'payment_intent.amount_capturable_updated':
        paymentStatus = 'authorized'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'authorized')
        break
      case 'charge.refunded':
        paymentStatus = 'refunded'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'refunded')
        break
    }

    await transactionRepository.updateStatus(transaction._id, paymentStatus)

    return { success: true, transactionId: transaction._id }
  }

  async handlePayPalWebhook(event) {
    const transaction = await transactionRepository.findByTransactionId(event.resource.id)
    if (!transaction) {
      // Try to find by order ID
      const order = await orderRepository.findByOrderNumber(event.resource.custom_id)
      if (order && order.transactions.length > 0) {
        const tx = await transactionRepository.findById(order.transactions[0])
        if (tx) {
          await transactionRepository.addWebhookEvent(tx._id, {
            eventId: event.id,
            eventType: event.event_type,
            payload: event.resource,
          })
          return { success: true, transactionId: tx._id }
        }
      }
      throw new Error('Transaction not found')
    }

    // Record webhook event
    await transactionRepository.addWebhookEvent(transaction._id, {
      eventId: event.id,
      eventType: event.event_type,
      payload: event.resource,
    })

    let paymentStatus = transaction.status

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        paymentStatus = 'captured'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'captured')
        break
      case 'PAYMENT.CAPTURE.REFUNDED':
        paymentStatus = 'refunded'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'refunded')
        break
      case 'PAYMENT.CAPTURE.DENIED':
        paymentStatus = 'failed'
        await orderService.updatePaymentStatus(transaction.order.toString(), 'failed')
        break
    }

    await transactionRepository.updateStatus(transaction._id, paymentStatus)

    return { success: true, transactionId: transaction._id }
  }

  async captureStripePayment(intentId) {
    const transaction = await transactionRepository.findByIntentId(intentId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    const paymentIntent = await stripeLib.capturePaymentIntent(intentId)
    
    await transactionRepository.updateStatus(transaction._id, 'captured')
    await orderService.updatePaymentStatus(transaction.order.toString(), 'captured')

    return paymentIntent
  }

  async capturePayPalOrder(orderId) {
    const transaction = await transactionRepository.findByIntentId(orderId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    const capture = await paypalLib.captureOrder(orderId)
    
    await transactionRepository.updateStatus(transaction._id, 'captured')
    await orderService.updatePaymentStatus(transaction.order.toString(), 'captured')

    return capture
  }

  async refundStripePayment(intentId, amount = null) {
    const transaction = await transactionRepository.findByIntentId(intentId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    const refund = await stripeLib.createRefund(intentId, amount)
    
    await transactionRepository.updateStatus(transaction._id, 'refunded')
    await orderService.updatePaymentStatus(transaction.order.toString(), 'refunded')

    return refund
  }

  async refundPayPalPayment(captureId, amount = null) {
    const transaction = await transactionRepository.findByTransactionId(captureId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    const refund = await paypalLib.refundOrder(captureId, amount, transaction.currency)
    
    await transactionRepository.updateStatus(transaction._id, 'refunded')
    await orderService.updatePaymentStatus(transaction.order.toString(), 'refunded')

    return refund
  }
}

export default new PaymentService()

