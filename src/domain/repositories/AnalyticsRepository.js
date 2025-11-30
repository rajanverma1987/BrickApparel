import Analytics from '../models/Analytics'

class AnalyticsRepository {
  async create(data) {
    return await Analytics.create(data)
  }

  async findById(id) {
    return await Analytics.findById(id).populate('product')
  }

  async findByDateRange(startDate, endDate, productId = null) {
    const query = {
      date: { $gte: startDate, $lte: endDate },
    }
    if (productId) {
      query.product = productId
    }
    return await Analytics.find(query).populate('product').sort({ date: 1 })
  }

  async findByProduct(productId, startDate, endDate) {
    return await Analytics.find({
      product: productId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 })
  }

  async updateOrCreate(date, productId, metrics) {
    return await Analytics.findOneAndUpdate(
      { date, product: productId },
      { $inc: metrics },
      { upsert: true, new: true }
    )
  }

  async aggregateRevenue(startDate, endDate) {
    return await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$metrics.revenue' },
          totalPurchases: { $sum: '$metrics.purchases' },
          totalViews: { $sum: '$metrics.views' },
        },
      },
    ])
  }
}

export default new AnalyticsRepository()

