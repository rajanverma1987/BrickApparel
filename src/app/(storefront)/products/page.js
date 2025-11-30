import connectDB from '../../../lib/db/mongoose'
import productRepository from '../../../domain/repositories/ProductRepository'
import categoryRepository from '../../../domain/repositories/CategoryRepository'
import reviewService from '../../../domain/services/ReviewService'
import ProductGrid from '../../../components/storefront/ProductGrid'

export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category
  const search = searchParams?.search

  if (search) {
    return {
      title: `Search Results for "${search}" | Brick Apparel`,
      description: `Find ${search} at Brick Apparel. Shop the latest fashion trends and premium clothing.`,
      keywords: `${search}, clothing, fashion, apparel`,
    }
  }

  if (category) {
    return {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} | Brick Apparel`,
      description: `Shop ${category} at Brick Apparel. Premium quality clothing and fashion items.`,
      keywords: `${category}, clothing, fashion, apparel`,
    }
  }

  return {
    title: 'All Products | Brick Apparel',
    description: 'Browse our complete collection of premium clothing and fashion items. Find the perfect style for every occasion.',
    keywords: 'clothing, fashion, apparel, men, women, shoes, accessories',
  }
}

export default async function ProductsPage({ searchParams }) {
  await connectDB()

  // Import models to ensure they're registered
  await import('../../../domain/models/Product')
  await import('../../../domain/models/Review')
  await import('../../../domain/models/Order')
  await import('../../../domain/models/Customer')
  await import('../../../domain/models/Guest')

  const category = searchParams?.category
  const search = searchParams?.search

  let products = []

  if (search) {
    products = await productRepository.search(search)
  } else if (category) {
    const categoryDoc = await categoryRepository.findBySlug(category)
    if (categoryDoc) {
      products = await productRepository.findByCategory(categoryDoc._id)
    }
  } else {
    products = await productRepository.findAll()
  }

  const categories = await categoryRepository.findAll()

  // Convert Mongoose documents to plain objects
  const productsData = products.map(p => JSON.parse(JSON.stringify(p)))
  const categoriesData = categories.map(c => JSON.parse(JSON.stringify(c)))

  // Fetch rating stats for each product
  const productsWithRatings = await Promise.all(
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-primary-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/products"
                  className="text-gray-700 hover:text-primary-600 hover:font-semibold transition-all block py-2 px-3 rounded-lg hover:bg-primary-50"
                >
                  All Products
                </a>
              </li>
              {categoriesData.map((cat) => (
                <li key={cat._id.toString()}>
                  <a
                    href={`/products?category=${cat.slug}`}
                    className="text-gray-700 hover:text-primary-600 hover:font-semibold transition-all block py-2 px-3 rounded-lg hover:bg-primary-50"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Products
            </h1>
            {search && <p className="text-gray-600 text-lg">Search results for: &quot;{search}&quot;</p>}
          </div>
          <ProductGrid products={productsWithRatings} />
        </div>
      </div>
    </div>
  )
}

