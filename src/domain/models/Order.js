import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
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
  total: {
    type: Number,
    required: true,
  },
})

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: String,
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'US',
  },
  phone: String,
})

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
      default: null,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: {
      type: addressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'shipped', 'delivered', 'refunded', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'refunded', 'failed'],
      default: 'pending',
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  }
)

// orderNumber index is already created by unique: true
orderSchema.index({ customer: 1 })
orderSchema.index({ guest: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)

