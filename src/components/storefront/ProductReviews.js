'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { addReviewAction } from '../../actions/review-actions'
import { useToast } from '../ui/ToastProvider'
import Button from '../ui/Button'

function StarRating({ rating, onRatingChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          disabled={readonly}
          className={`text-2xl transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

function ReviewItem({ review }) {
  const displayName = review.customer
    ? `${review.customer.firstName || ''} ${review.customer.lastName || ''}`.trim() || 'Customer'
    : review.guestName || 'Guest'

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800">{review.title || 'No Title'}</h4>
            {review.isVerified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} readonly />
            <span className="text-sm text-gray-600">{displayName}</span>
            <span className="text-xs text-gray-400">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
      )}
    </div>
  )
}

export default function ProductReviews({ productId, reviews = [], ratingStats = null, isLoggedIn = false }) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      showToast('Please select a rating', 'error')
      return
    }

    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('rating', rating.toString())
    if (title) formData.append('title', title)
    if (comment) formData.append('comment', comment)
    if (guestName) formData.append('guestName', guestName)
    if (guestEmail) formData.append('guestEmail', guestEmail)

    startTransition(async () => {
      const result = await addReviewAction(formData)

      if (result.success) {
        showToast(result.message || 'Review submitted successfully!', 'success')
        setShowForm(false)
        setRating(0)
        setTitle('')
        setComment('')
        setGuestName('')
        setGuestEmail('')
        router.refresh()
      } else {
        showToast(result.error || 'Failed to submit review', 'error')
      }
    })
  }

  return (
    <div id="reviews" className="mt-12 border-t border-gray-200 pt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
        
        {ratingStats && ratingStats.totalReviews > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">
                {ratingStats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(ratingStats.averageRating)} readonly />
              <div className="text-sm text-gray-600 mt-1">
                {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.ratingDistribution[star] || 0
                const percentage = ratingStats.totalReviews > 0
                  ? (count / ratingStats.totalReviews) * 100
                  : 0
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6"
          >
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-accent-600">*</span>
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Review Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Summarize your experience"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts about this product..."
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/2000 characters</p>
          </div>

          {!isLoggedIn && (
            <>
              <div className="mb-4">
                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-accent-600">*</span>
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required={!isLoggedIn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email <span className="text-accent-600">*</span>
                </label>
                <input
                  type="email"
                  id="guestEmail"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required={!isLoggedIn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending || rating === 0}>
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false)
                setRating(0)
                setTitle('')
                setComment('')
                setGuestName('')
                setGuestEmail('')
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  )
}

