import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      addToCart: {
        type: Number,
        default: 0,
      },
      purchases: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
)

analyticsSchema.index({ date: 1, product: 1 }, { unique: true })

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema)

