import mongoose from 'mongoose'

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['banner', 'section', 'featured_products', 'text'],
      required: true,
    },
    title: String,
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayConditions: {
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
)

contentBlockSchema.index({ order: 1 })
contentBlockSchema.index({ isActive: 1 })

export default mongoose.models.ContentBlock || mongoose.model('ContentBlock', contentBlockSchema)

