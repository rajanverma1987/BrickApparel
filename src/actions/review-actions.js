'use server'

import { cookies } from 'next/headers'
import connectDB from '../lib/db/mongoose'
import reviewService from '../domain/services/ReviewService'
import { getCustomer } from '../lib/auth/session'

export async function addReviewAction(formData) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('customerToken')?.value
    const customer = token ? await getCustomer(token) : null

    const productId = formData.get('productId')
    const rating = parseInt(formData.get('rating'))
    const title = formData.get('title')?.trim()
    const comment = formData.get('comment')?.trim()
    const guestName = formData.get('guestName')?.trim()
    const guestEmail = formData.get('guestEmail')?.trim()

    // Validate required fields
    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' }
    }

    // Either customer must be logged in, or guest name and email must be provided
    if (!customer && (!guestName || !guestEmail)) {
      return { success: false, error: 'Please provide your name and email, or log in to review' }
    }

    const reviewData = {
      product: productId,
      rating,
      title: title || undefined,
      comment: comment || undefined,
    }

    if (customer) {
      reviewData.customer = customer._id.toString()
    } else {
      reviewData.guestName = guestName
      reviewData.guestEmail = guestEmail
    }

    await reviewService.createReview(reviewData)

    return { success: true, message: 'Review submitted successfully' }
  } catch (error) {
    return { success: false, error: error.message || 'Failed to submit review' }
  }
}

