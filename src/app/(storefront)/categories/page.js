import connectDB from '../../../lib/db/mongoose'
import categoryRepository from '../../../domain/repositories/CategoryRepository'
import productRepository from '../../../domain/repositories/ProductRepository'
import Link from 'next/link'
import Image from 'next/image'
import Card from '../../../components/ui/Card'

export default async function CategoriesPage() {
  await connectDB()

  const categories = await categoryRepository.findAll()
  
  // Get product count for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const products = await productRepository.findByCategory(category._id)
      const categoryObj = category.toObject ? category.toObject() : category
      return {
        ...JSON.parse(JSON.stringify(categoryObj)),
        productCount: products.length,
      }
    })
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Shop by Category
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our wide range of clothing categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriesWithCounts.map((category) => (
          <Link key={category._id.toString()} href={`/products?category=${category.slug}`}>
            <Card className="hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer h-full text-center">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 mb-4">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{category.name}</h2>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <p className="text-primary-600 font-semibold">
                {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

