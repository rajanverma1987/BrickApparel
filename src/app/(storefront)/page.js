import connectDB from '../../lib/db/mongoose'
import contentBlockRepository from '../../domain/repositories/ContentBlockRepository'
import productRepository from '../../domain/repositories/ProductRepository'
import reviewService from '../../domain/services/ReviewService'
import ProductGrid from '../../components/storefront/ProductGrid'

export const metadata = {
  title: 'Brick Apparel - Premium Clothing Store | Shop Latest Fashion Trends',
  description: 'Shop the latest fashion trends at Brick Apparel. Premium quality clothing for men and women. Discover stylish apparel, shoes, and accessories.',
  keywords: 'clothing, fashion, apparel, men clothing, women clothing, shoes, accessories, premium fashion, online clothing store',
  openGraph: {
    title: 'Brick Apparel - Premium Clothing Store',
    description: 'Shop the latest fashion trends at Brick Apparel. Premium quality clothing for men and women.',
    type: 'website',
    siteName: 'Brick Apparel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brick Apparel - Premium Clothing Store',
    description: 'Shop the latest fashion trends at Brick Apparel.',
  },
}

export default async function HomePage() {
  try {
    await connectDB()

    // Import models to ensure they're registered
    await import('../../domain/models/Product')
    await import('../../domain/models/Review')
    await import('../../domain/models/Order')
    await import('../../domain/models/Customer')
    await import('../../domain/models/Guest')

    const [contentBlocks, featuredProducts] = await Promise.all([
      contentBlockRepository.findAll().catch(() => []),
      productRepository.findAll({}, { limit: 8 }).catch(() => []),
    ])

    // Convert Mongoose documents to plain objects for serialization
    let products = []
    let blocks = []
    
    try {
      if (Array.isArray(featuredProducts) && featuredProducts.length > 0) {
        const productsData = featuredProducts.map(product => {
          const productObj = product.toObject ? product.toObject() : product
          return JSON.parse(JSON.stringify(productObj))
        })
        
        // Fetch rating stats for each product
        products = await Promise.all(
          productsData.map(async (product) => {
            try {
              const productId = product._id?.toString() || product._id
              const ratingStats = await reviewService.getProductRatingStats(productId)
              // Serialize ratingStats to ensure it's a plain object
              const serializedStats = JSON.parse(JSON.stringify(ratingStats))
              // Always include ratingStats, even if 0, so component can decide
              return {
                ...product,
                ratingStats: serializedStats
              }
            } catch (error) {
              console.error(`Error fetching rating for product ${product._id}:`, error)
              return { 
                ...product, 
                ratingStats: {
                  averageRating: 0,
                  totalReviews: 0,
                  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
              }
            }
          })
        )
      }
    } catch (err) {
      console.error('Error serializing products:', err)
    }

    try {
      if (Array.isArray(contentBlocks) && contentBlocks.length > 0) {
        blocks = contentBlocks.map(block => {
          const blockObj = block.toObject ? block.toObject() : block
          return JSON.parse(JSON.stringify(blockObj))
        })
      }
    } catch (err) {
      console.error('Error serializing content blocks:', err)
    }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Content Blocks */}
      {blocks.map((block) => (
        <div key={block._id.toString()} className="mb-12">
          {block.type === 'banner' && (
            <div className="gradient-primary text-white rounded-2xl p-12 text-center shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
              <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">{block.content.title}</h2>
              <p className="text-xl mb-8 text-white/95">{block.content.description}</p>
              {block.content.ctaLink && (
                <a
                  href={block.content.ctaLink}
                  className="inline-block bg-accent-600 text-white px-8 py-4 rounded-full font-bold hover:bg-accent-700 hover:scale-105 transition-all shadow-xl text-lg transform"
                >
                  {block.content.ctaText || 'Shop Now'}
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Featured Products */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-primary-600">
            Featured Products
          </h2>
          <p className="text-gray-600">Discover our handpicked favorites</p>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products available at the moment.</p>
            <p className="text-gray-400 text-sm">Please check back later or contact support if this persists.</p>
          </div>
        )}
      </section>
    </div>
  )
  } catch (error) {
    console.error('Error loading homepage:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Unable to load products.</p>
          <p className="text-gray-400 text-sm">Please check your database connection.</p>
        </div>
      </div>
    )
  }
}

