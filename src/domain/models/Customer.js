import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
  isDefault: {
    type: Boolean,
    default: false,
  },
})

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: String,
    addresses: [addressSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

customerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema)

