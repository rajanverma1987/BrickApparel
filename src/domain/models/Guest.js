import mongoose from 'mongoose'

const guestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
)

guestSchema.index({ email: 1 })

export default mongoose.models.Guest || mongoose.model('Guest', guestSchema)

