import reviewRepository from '../repositories/ReviewRepository'
import orderRepository from '../repositories/OrderRepository'

class ReviewService {
  async createReview(data) {
    // Validate rating
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Check if customer or guest email is provided
    if (!data.customer && !data.guestEmail) {
      throw new Error('Either customer ID or guest email is required')
    }

    // Check if customer has already reviewed this product
    if (data.customer) {
      const existingReviews = await reviewRepository.findByCustomer(data.customer, data.product)
      if (existingReviews && existingReviews.length > 0) {
        throw new Error('You have already reviewed this product')
      }
    } else if (data.guestEmail) {
      const existingReviews = await reviewRepository.findByGuestEmail(data.guestEmail, data.product)
      if (existingReviews && existingReviews.length > 0) {
        throw new Error('You have already reviewed this product')
      }
    }

    // Check if customer has purchased the product (for verified badge)
    let isVerified = false
    if (data.customer) {
      const orders = await orderRepository.findByCustomer(data.customer, {
        status: { $in: ['captured', 'shipped', 'delivered'] }
      })
      
      for (const order of orders) {
        const hasProduct = order.items.some(
          item => item.product.toString() === data.product.toString()
        )
        if (hasProduct) {
          isVerified = true
          break
        }
      }
    }

    const reviewData = {
      ...data,
      isVerified,
      isApproved: true, // Auto-approve for now
    }

    return await reviewRepository.create(reviewData)
  }

  async getProductReviews(productId, options = {}) {
    return await reviewRepository.findByProduct(productId, options)
  }

  async getProductRatingStats(productId) {
    return await reviewRepository.getAverageRating(productId)
  }

  async getCustomerReview(customerId, productId) {
    const reviews = await reviewRepository.findByCustomer(customerId, productId)
    return reviews.find(r => r.product.toString() === productId.toString()) || null
  }

  async updateReview(reviewId, data, customerId = null) {
    const review = await reviewRepository.findById(reviewId)
    if (!review) {
      throw new Error('Review not found')
    }

    // Check if customer owns the review
    if (customerId && review.customer?.toString() !== customerId.toString()) {
      throw new Error('You can only update your own reviews')
    }

    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5')
    }

    return await reviewRepository.update(reviewId, data)
  }

  async deleteReview(reviewId, customerId = null) {
    const review = await reviewRepository.findById(reviewId)
    if (!review) {
      throw new Error('Review not found')
    }

    // Check if customer owns the review
    if (customerId && review.customer?.toString() !== customerId.toString()) {
      throw new Error('You can only delete your own reviews')
    }

    return await reviewRepository.delete(reviewId)
  }
}

export default new ReviewService()

