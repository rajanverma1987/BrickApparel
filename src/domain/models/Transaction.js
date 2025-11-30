import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    intentId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'refunded', 'failed'],
      default: 'pending',
    },
    webhookEvents: [
      {
        eventId: String,
        eventType: String,
        payload: mongoose.Schema.Types.Mixed,
        receivedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
)

transactionSchema.index({ order: 1 })
// transactionId index is already created by index: true in field definition
// intentId index is already created by index: true in field definition

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

