import Order from '../models/Order'

class OrderRepository {
  async create(data) {
    return await Order.create(data)
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('customer')
      .populate('guest')
      .populate('items.product')
      .populate('transactions')
  }

  async findByOrderNumber(orderNumber) {
    return await Order.findOne({ orderNumber })
      .populate('customer')
      .populate('guest')
      .populate('items.product')
      .populate('transactions')
  }

  async findByCustomer(customerId, filters = {}) {
    const query = { customer: customerId, ...filters }
    return await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
  }

  async findByGuest(guestId, filters = {}) {
    const query = { guest: guestId, ...filters }
    return await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
  }

  async findAll(filters = {}, options = {}) {
    let mongooseQuery = Order.find(filters)
      .populate('customer')
      .populate('guest')
      .populate('items.product')
      .sort({ createdAt: -1 })
    
    if (options.limit) {
      mongooseQuery = mongooseQuery.limit(options.limit)
    }
    
    return await mongooseQuery
  }

  async update(id, data) {
    return await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async updateStatus(id, status) {
    return await Order.findByIdAndUpdate(
      id,
      { status, ...(status === 'shipped' ? { shippedAt: new Date() } : {}) },
      { new: true }
    )
  }

  async updatePaymentStatus(id, paymentStatus) {
    return await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true })
  }

  async addTransaction(orderId, transactionId) {
    return await Order.findByIdAndUpdate(
      orderId,
      { $push: { transactions: transactionId } },
      { new: true }
    )
  }
}

export default new OrderRepository()

