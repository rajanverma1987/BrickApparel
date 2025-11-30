import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    size: String,
    color: String,
    sku: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
})

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    items: [cartItemSchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
)

// sessionId index is already created by index: true in field definition
cartSchema.index({ customerId: 1 })

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema)

