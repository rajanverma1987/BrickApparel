import mongoose from 'mongoose'

// Import all models to ensure they're registered
import '../../domain/models/Category'
import '../../domain/models/Product'
import '../../domain/models/Cart'
import '../../domain/models/Order'
import '../../domain/models/Customer'
import '../../domain/models/Guest'
import '../../domain/models/AdminUser'
import '../../domain/models/Review'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

