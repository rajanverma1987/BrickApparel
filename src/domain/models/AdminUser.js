import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminUserSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff'],
      default: 'staff',
    },
    permissions: {
      products: {
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      orders: {
        view: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        refund: { type: Boolean, default: false },
      },
      inventory: {
        view: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
      },
      content: {
        view: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema)

