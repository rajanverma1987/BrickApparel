import Transaction from '../models/Transaction'

class TransactionRepository {
  async create(data) {
    return await Transaction.create(data)
  }

  async findById(id) {
    return await Transaction.findById(id).populate('order')
  }

  async findByTransactionId(transactionId) {
    return await Transaction.findOne({ transactionId })
  }

  async findByIntentId(intentId) {
    return await Transaction.findOne({ intentId })
  }

  async findByOrder(orderId) {
    return await Transaction.find({ order: orderId }).sort({ createdAt: -1 })
  }

  async findAll(filters = {}, options = {}) {
    let mongooseQuery = Transaction.find(filters)
      .populate('order')
      .sort({ createdAt: -1 })
    
    if (options.limit) {
      mongooseQuery = mongooseQuery.limit(options.limit)
    }
    
    return await mongooseQuery
  }

  async update(id, data) {
    return await Transaction.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async updateStatus(id, status) {
    return await Transaction.findByIdAndUpdate(id, { status }, { new: true })
  }

  async addWebhookEvent(id, event) {
    return await Transaction.findByIdAndUpdate(
      id,
      { $push: { webhookEvents: event } },
      { new: true }
    )
  }
}

export default new TransactionRepository()

