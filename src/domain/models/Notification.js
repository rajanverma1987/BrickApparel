import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['new_order', 'payment_authorized', 'payment_captured', 'payment_refunded', 'low_stock', 'order_status_change'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
)

notificationSchema.index({ isRead: 1 })
notificationSchema.index({ createdAt: -1 })

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

