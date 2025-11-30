import Review from '../models/Review'

class ReviewRepository {
  async create(data) {
    return await Review.create(data)
  }

  async findById(id) {
    return await Review.findById(id)
      .populate('product', 'name slug')
      .populate('customer', 'firstName lastName email')
  }

  async findByProduct(productId, filters = {}) {
    const query = { product: productId, isApproved: true, ...filters }
    return await Review.find(query)
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 })
  }

  async findByCustomer(customerId, productId = null) {
    const query = { customer: customerId }
    if (productId) {
      query.product = productId
    }
    return await Review.find(query)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
  }

  async findByGuestEmail(email, productId = null) {
    const query = { guestEmail: email.toLowerCase() }
    if (productId) {
      query.product = productId
    }
    return await Review.find(query)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
  }

  async getAverageRating(productId) {
    const result = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ])

    if (!result || result.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const data = result[0]
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    data.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1
    })

    return {
      averageRating: Math.round(data.averageRating * 10) / 10,
      totalReviews: data.totalReviews,
      ratingDistribution: distribution
    }
  }

  async update(id, data) {
    return await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return await Review.findByIdAndDelete(id)
  }

  async findAll(filters = {}, options = {}) {
    let mongooseQuery = Review.find(filters)
      .populate('product', 'name slug')
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })

    if (options.limit) {
      mongooseQuery = mongooseQuery.limit(options.limit)
    }

    return await mongooseQuery
  }
}

export default new ReviewRepository()

