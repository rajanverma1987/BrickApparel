import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve for now, can be changed to false for moderation
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
reviewSchema.index({ product: 1, isApproved: 1 })
reviewSchema.index({ customer: 1, product: 1 })
reviewSchema.index({ createdAt: -1 })

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)

