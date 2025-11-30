import connectDB from '../lib/db/mongoose'
import productRepository from '../domain/repositories/ProductRepository'
import categoryRepository from '../domain/repositories/CategoryRepository'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brickapparel.com'
  
  await connectDB()

  // Get all active products
  const products = await productRepository.findAll()
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Get all categories
  const categories = await categoryRepository.findAll()
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: category.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticPages, ...categoryUrls, ...productUrls]
}

