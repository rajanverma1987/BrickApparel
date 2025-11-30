import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({ product }) {
  if (!product) return null

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  
  let priceDisplay = 'Price unavailable'
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => v.price).filter(p => typeof p === 'number')
    if (prices.length > 0) {
      const lowestPrice = Math.min(...prices)
      const highestPrice = Math.max(...prices)
      priceDisplay = lowestPrice === highestPrice 
        ? `$${lowestPrice.toFixed(2)}` 
        : `$${lowestPrice.toFixed(2)} - $${highestPrice.toFixed(2)}`
    }
  }

  const ratingStats = product.ratingStats

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={primaryImage.url.includes('unsplash.com')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>No Image</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-gray-800">
            {product.name}
          </h3>
          
          {/* Rating Display */}
          {ratingStats && ratingStats.totalReviews > 0 && ratingStats.averageRating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Math.round(ratingStats.averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {ratingStats.averageRating?.toFixed(1) || '0.0'} ({ratingStats.totalReviews || 0})
              </span>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
          <p className="text-primary-600 font-bold text-xl">
            {priceDisplay}
          </p>
        </div>
      </div>
    </Link>
  )
}

