import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'

// Load environment variables from .env.local FIRST
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')

config({ path: envPath })
console.log('Loaded environment variables from .env.local')

// Import models directly (they will register themselves with mongoose)
const { default: Product } = await import('../src/domain/models/Product.js')
const { default: Review } = await import('../src/domain/models/Review.js')
const { default: Customer } = await import('../src/domain/models/Customer.js')

// Connect to MongoDB directly
const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }
  return await mongoose.connect(MONGODB_URI)
}

const sampleReviews = [
  {
    rating: 5,
    title: 'Excellent quality!',
    comment: 'This product exceeded my expectations. The quality is outstanding and it fits perfectly. Highly recommend!',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.johnson@example.com',
  },
  {
    rating: 4,
    title: 'Great product, fast shipping',
    comment: 'Really happy with my purchase. The material is soft and comfortable. Shipping was quick too.',
    guestName: 'Michael Chen',
    guestEmail: 'michael.chen@example.com',
  },
  {
    rating: 5,
    title: 'Love it!',
    comment: 'Perfect fit and great quality. Will definitely order again.',
    guestName: 'Emily Davis',
    guestEmail: 'emily.davis@example.com',
  },
  {
    rating: 3,
    title: 'Good but could be better',
    comment: 'The product is okay, but I expected better quality for the price. It\'s decent but not exceptional.',
    guestName: 'David Wilson',
    guestEmail: 'david.wilson@example.com',
  },
  {
    rating: 5,
    title: 'Amazing quality',
    comment: 'This is one of the best purchases I\'ve made. The quality is top-notch and it looks great.',
    guestName: 'Jessica Martinez',
    guestEmail: 'jessica.martinez@example.com',
  },
  {
    rating: 4,
    title: 'Very satisfied',
    comment: 'Good product overall. The sizing is accurate and the material feels nice. Would recommend.',
    guestName: 'Robert Taylor',
    guestEmail: 'robert.taylor@example.com',
  },
  {
    rating: 5,
    title: 'Perfect!',
    comment: 'Exactly what I was looking for. Great quality, fast delivery, and excellent customer service.',
    guestName: 'Amanda Brown',
    guestEmail: 'amanda.brown@example.com',
  },
  {
    rating: 2,
    title: 'Not as expected',
    comment: 'The product didn\'t meet my expectations. The quality seems lower than advertised.',
    guestName: 'James Anderson',
    guestEmail: 'james.anderson@example.com',
  },
  {
    rating: 4,
    title: 'Good value',
    comment: 'For the price, this is a good deal. The quality is decent and it serves its purpose well.',
    guestName: 'Lisa Garcia',
    guestEmail: 'lisa.garcia@example.com',
  },
  {
    rating: 5,
    title: 'Highly recommend',
    comment: 'Outstanding product! The quality is excellent and it\'s very comfortable. Will buy again!',
    guestName: 'Christopher Lee',
    guestEmail: 'christopher.lee@example.com',
  },
]

async function seedReviews() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Get all products
    const products = await Product.find({ isActive: true }).limit(20)
    
    if (products.length === 0) {
      console.log('No products found. Please seed products first.')
      process.exit(1)
    }

    console.log(`Found ${products.length} products`)

    // Clear existing reviews
    await Review.deleteMany({})
    console.log('Cleared existing reviews')

    // Get customers if any exist
    const customers = await Customer.find({ isActive: true }).limit(10)
    console.log(`Found ${customers.length} customers`)

    let reviewCount = 0

    // Add reviews to each product
    for (const product of products) {
      // Add 3-8 reviews per product
      const numReviews = Math.floor(Math.random() * 6) + 3
      
      for (let i = 0; i < numReviews; i++) {
        const reviewTemplate = sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
        
        // Randomly assign to customer or guest
        const useCustomer = customers.length > 0 && Math.random() > 0.5
        
        const reviewData = {
          product: product._id,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          comment: reviewTemplate.comment,
          isVerified: Math.random() > 0.3, // 70% verified purchases
          isApproved: true,
        }

        if (useCustomer) {
          const customer = customers[Math.floor(Math.random() * customers.length)]
          reviewData.customer = customer._id
        } else {
          reviewData.guestName = reviewTemplate.guestName
          reviewData.guestEmail = reviewTemplate.guestEmail
        }

        await Review.create(reviewData)
        reviewCount++
      }
    }

    console.log(`✅ Created ${reviewCount} reviews for ${products.length} products`)
    
    // Show summary
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          verifiedCount: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      }
    ])

    if (stats.length > 0) {
      console.log('\n📊 Review Statistics:')
      console.log(`   Total Reviews: ${stats[0].totalReviews}`)
      console.log(`   Average Rating: ${stats[0].avgRating.toFixed(2)}`)
      console.log(`   Verified Purchases: ${stats[0].verifiedCount}`)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding reviews:', error)
    process.exit(1)
  }
}

seedReviews()

