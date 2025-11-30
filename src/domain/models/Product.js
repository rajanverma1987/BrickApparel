import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  colorHex: {
    type: String,
    required: true,
    default: '#CCCCCC',
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    min: 0,
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
  ],
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    variants: [variantSchema],
    tags: [String],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
)

productSchema.index({ name: 'text', description: 'text', tags: 'text' })
// slug index is already created by unique: true
productSchema.index({ category: 1 })
// variants.sku index is already created by unique: true in variantSchema

export default mongoose.models.Product || mongoose.model('Product', productSchema)

