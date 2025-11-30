import connectDB from '../../../../lib/db/mongoose'
import productService from '../../../../domain/services/ProductService'
import reviewService from '../../../../domain/services/ReviewService'
import { getCustomer } from '../../../../lib/auth/session'
import { cookies } from 'next/headers'
import ProductDetail from '../../../../components/storefront/ProductDetail'

export async function generateMetadata({ params }) {
  await connectDB()
  
  let product
  try {
    product = await productService.getProductBySlug(params.slug)
    product = JSON.parse(JSON.stringify(product))
  } catch (error) {
    product = null
  }

  if (!product) {
    return {
      title: 'Product Not Found | Brick Apparel',
      description: 'The product you are looking for could not be found.',
    }
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const price = Math.min(...product.variants.map(v => v.price))
  const description = product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `${product.name} - Shop now at Brick Apparel`

  return {
    title: `${product.name} | Brick Apparel`,
    description: description,
    keywords: `${product.name}, ${product.category?.name || ''}, clothing, fashion, ${product.variants?.map(v => v.color).join(', ') || ''}`,
    openGraph: {
      title: product.name,
      description: description,
      images: primaryImage ? [{
        url: primaryImage.url,
        width: 1200,
        height: 1200,
        alt: primaryImage.alt || product.name,
      }] : [],
      type: 'website',
      siteName: 'Brick Apparel',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: primaryImage ? [primaryImage.url] : [],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  }
}

export default async function ProductDetailPage({ params }) {
  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Product')
  await import('../../../../domain/models/Review')
  await import('../../../../domain/models/Order')
  await import('../../../../domain/models/Customer')
  await import('../../../../domain/models/Guest')

  let product
  try {
    product = await productService.getProductBySlug(params.slug)
    // Convert to plain object
    product = JSON.parse(JSON.stringify(product))
  } catch (error) {
    product = null
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <a href="/products" className="text-primary-600 hover:underline">
          Back to Products
        </a>
      </div>
    )
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const sizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : []
  // Get unique colors with their hex values
  const colorMap = new Map()
  product.variants?.forEach(v => {
    if (!colorMap.has(v.color)) {
      colorMap.set(v.color, v.colorHex || '#CCCCCC')
    }
  })
  const colors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }))
  const price = Math.min(...product.variants.map(v => v.price))
  const maxPrice = Math.max(...product.variants.map(v => v.price))
  const priceRange = price === maxPrice ? price.toFixed(2) : `${price.toFixed(2)} - ${maxPrice.toFixed(2)}`
  const availability = product.variants?.some(v => v.stock > 0) ? 'InStock' : 'OutOfStock'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brickapparel.com'

  // Fetch reviews and rating stats
  let reviews = []
  let ratingStats = null
  let isLoggedIn = false
  try {
    reviews = await reviewService.getProductReviews(product._id.toString())
    reviews = JSON.parse(JSON.stringify(reviews))
    ratingStats = await reviewService.getProductRatingStats(product._id.toString())
    // Ensure ratingStats is serializable
    ratingStats = JSON.parse(JSON.stringify(ratingStats))
    
    // Check if customer is logged in
    const cookieStore = await cookies()
    const token = cookieStore.get('customerToken')?.value
    if (token) {
      const customer = await getCustomer(token)
      isLoggedIn = !!customer
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Set default ratingStats on error
    ratingStats = {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description?.replace(/<[^>]*>/g, '').substring(0, 500) || product.name,
    image: product.images?.map(img => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: 'Brick Apparel',
    },
    category: product.category?.name || 'Clothing',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: price.toFixed(2),
      highPrice: maxPrice.toFixed(2),
      availability: `https://schema.org/${availability}`,
      url: `${baseUrl}/products/${product.slug}`,
    },
    sku: product.sku || product._id.toString(),
    mpn: product.sku || product._id.toString(),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail
          productId={product._id?.toString() || product._id}
          productName={product.name}
          priceRange={priceRange}
          category={product.category}
          description={product.description}
          sizes={sizes}
          colors={colors}
          variants={product.variants || []}
          defaultImage={primaryImage}
          productImages={product.images || []}
          reviews={reviews}
          ratingStats={ratingStats}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </>
  )
}

