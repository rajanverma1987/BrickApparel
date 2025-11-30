import orderRepository from '../repositories/OrderRepository'
import cartService from './CartService'
import inventoryService from './InventoryService'
import productService from './ProductService'
import guestRepository from '../repositories/GuestRepository'
import customerRepository from '../repositories/CustomerRepository'
import notificationRepository from '../repositories/NotificationRepository'

class OrderService {
  async createOrder(cart, shippingAddress, billingAddress, customerId = null, guestEmail = null) {
    // Validate cart has items
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }

    // Validate inventory for all items
    for (const item of cart.items) {
      await productService.checkInventory(item.variant.sku, item.quantity)
    }

    // Create or get guest if needed
    let guest = null
    if (!customerId && guestEmail) {
      guest = await guestRepository.findOrCreate(guestEmail, {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = this.calculateShippingCost(subtotal)
    const tax = this.calculateTax(subtotal + shippingCost, shippingAddress.state)
    const total = subtotal + shippingCost + tax

    // Generate order number
    const orderNumber = this.generateOrderNumber()

    // Create order
    const orderData = {
      orderNumber,
      customer: customerId || null,
      guest: guest ? guest._id : null,
      items: cart.items.map((item) => ({
        product: item.product._id || item.product,
        productName: item.product.name || 'Product',
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
    }

    const order = await orderRepository.create(orderData)

    // Adjust inventory
    await inventoryService.adjustInventoryOnOrder(order)

    // Create notification
    await notificationRepository.create({
      type: 'new_order',
      title: 'New Order',
      message: `New order #${orderNumber} received`,
      order: order._id,
    })

    return order
  }

  async getOrder(id) {
    const order = await orderRepository.findById(id)
    if (!order) {
      throw new Error('Order not found')
    }
    return order
  }

  async getOrderByNumber(orderNumber) {
    const order = await orderRepository.findByOrderNumber(orderNumber)
    if (!order) {
      throw new Error('Order not found')
    }
    return order
  }

  async getCustomerOrders(customerId) {
    return await orderRepository.findByCustomer(customerId)
  }

  async getGuestOrders(guestId) {
    return await orderRepository.findByGuest(guestId)
  }

  async updateOrderStatus(id, status) {
    const order = await orderRepository.findById(id)
    if (!order) {
      throw new Error('Order not found')
    }

    const updatedOrder = await orderRepository.updateStatus(id, status)

    // Create notification
    await notificationRepository.create({
      type: 'order_status_change',
      title: 'Order Status Updated',
      message: `Order #${order.orderNumber} status changed to ${status}`,
      order: order._id,
    })

    return updatedOrder
  }

  async updatePaymentStatus(id, paymentStatus) {
    const order = await orderRepository.findById(id)
    if (!order) {
      throw new Error('Order not found')
    }

    // Update order status based on payment status
    let orderStatus = order.status
    if (paymentStatus === 'captured' && order.status === 'authorized') {
      orderStatus = 'captured'
    } else if (paymentStatus === 'refunded') {
      orderStatus = 'refunded'
      // Restore inventory
      await inventoryService.restoreInventoryOnRefund(order)
    }

    const updatedOrder = await orderRepository.update(id, {
      paymentStatus,
      status: orderStatus,
    })

    // Create notification
    await notificationRepository.create({
      type: `payment_${paymentStatus}`,
      title: `Payment ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}`,
      message: `Order #${order.orderNumber} payment status: ${paymentStatus}`,
      order: order._id,
    })

    return updatedOrder
  }

  calculateShippingCost(subtotal) {
    // Free shipping over $100, otherwise $10
    return subtotal >= 100 ? 0 : 10
  }

  calculateTax(subtotal, state) {
    // Simple tax calculation - 8% for CA, 6% for NY, 5% default
    const taxRates = {
      CA: 0.08,
      NY: 0.06,
    }
    const rate = taxRates[state] || 0.05
    return Math.round(subtotal * rate * 100) / 100
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ORD-${timestamp}-${random}`
  }
}

export default new OrderService()

