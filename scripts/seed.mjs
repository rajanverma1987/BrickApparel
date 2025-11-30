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

// Dynamic imports after env vars are loaded
const { default: connectDB } = await import('../src/lib/db/mongoose.js')
const { default: Category } = await import('../src/domain/models/Category.js')
const { default: Product } = await import('../src/domain/models/Product.js')
const { default: AdminUser } = await import('../src/domain/models/AdminUser.js')
const { default: ContentBlock } = await import('../src/domain/models/ContentBlock.js')

async function seed() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Category.deleteMany({})
    await Product.deleteMany({})
    await AdminUser.deleteMany({})
    await ContentBlock.deleteMany({})

    // Create categories
    const mensCategory = await Category.create({
      name: "Men's Clothing",
      slug: 'mens',
      description: 'Clothing for men',
    })

    const womensCategory = await Category.create({
      name: "Women's Clothing",
      slug: 'womens',
      description: 'Clothing for women',
    })

    const accessoriesCategory = await Category.create({
      name: "Accessories",
      slug: 'accessories',
      description: 'Fashion accessories',
    })

    const shoesCategory = await Category.create({
      name: "Shoes",
      slug: 'shoes',
      description: 'Footwear for all occasions',
    })

    // Create products with real clothing images
    const products = [
      // Men's Clothing
      {
        name: 'Classic White T-Shirt',
        slug: 'classic-white-t-shirt',
        description: 'A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        shortDescription: 'Comfortable white t-shirt',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
            alt: 'Classic White T-Shirt',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'White', sku: 'CWT-S-W', price: 29.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'M', color: 'White', sku: 'CWT-M-W', price: 29.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'L', color: 'White', sku: 'CWT-L-W', price: 29.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'XL', color: 'White', sku: 'CWT-XL-W', price: 29.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
        ],
        tags: ['t-shirt', 'casual', 'cotton'],
        seo: { title: 'Classic White T-Shirt - Brick Apparel', description: 'Shop our classic white t-shirt made from organic cotton.', keywords: ['t-shirt', 'white', 'cotton', 'casual'] },
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic fit denim jeans with a modern twist. Perfect for everyday wear.',
        shortDescription: 'Classic fit denim jeans',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
            alt: 'Denim Jeans',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '30', color: 'Blue', sku: 'DJ-30-B', price: 79.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '32', color: 'Blue', sku: 'DJ-32-B', price: 79.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '34', color: 'Blue', sku: 'DJ-34-B', price: 79.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '36', color: 'Blue', sku: 'DJ-36-B', price: 79.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['jeans', 'denim', 'pants'],
        seo: { title: 'Denim Jeans - Brick Apparel', description: 'Shop classic denim jeans at Brick Apparel.', keywords: ['jeans', 'denim', 'pants'] },
      },
      {
        name: 'Cotton Hoodie',
        slug: 'cotton-hoodie',
        description: 'Soft and cozy cotton hoodie perfect for cool weather. Features a front pocket and adjustable drawstring hood.',
        shortDescription: 'Comfortable cotton hoodie',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
            alt: 'Cotton Hoodie',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Gray', sku: 'CH-S-G', price: 59.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'M', color: 'Gray', sku: 'CH-M-G', price: 59.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'L', color: 'Gray', sku: 'CH-L-G', price: 59.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Gray', sku: 'CH-XL-G', price: 59.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
        ],
        tags: ['hoodie', 'sweatshirt', 'casual'],
        seo: { title: 'Cotton Hoodie - Brick Apparel', description: 'Shop our comfortable cotton hoodie.', keywords: ['hoodie', 'sweatshirt', 'casual'] },
      },
      {
        name: 'Button-Down Shirt',
        slug: 'button-down-shirt',
        description: 'Classic button-down shirt in crisp cotton. Perfect for business casual or smart casual occasions.',
        shortDescription: 'Classic button-down shirt',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594938291221-94f18e8a6d42?w=800&h=800&fit=crop',
            alt: 'Button-Down Shirt',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Blue', sku: 'BDS-S-B', price: 49.99, inventory: { quantity: 35, lowStockThreshold: 10 } },
          { size: 'M', color: 'Blue', sku: 'BDS-M-B', price: 49.99, inventory: { quantity: 35, lowStockThreshold: 10 } },
          { size: 'L', color: 'Blue', sku: 'BDS-L-B', price: 49.99, inventory: { quantity: 35, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Blue', sku: 'BDS-XL-B', price: 49.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['shirt', 'formal', 'business'],
        seo: { title: 'Button-Down Shirt - Brick Apparel', description: 'Shop our classic button-down shirt.', keywords: ['shirt', 'formal', 'business'] },
      },
      {
        name: 'Chino Pants',
        slug: 'chino-pants',
        description: 'Versatile chino pants that work for both casual and semi-formal occasions. Made from durable cotton twill.',
        shortDescription: 'Versatile chino pants',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop',
            alt: 'Chino Pants',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '30', color: 'Khaki', sku: 'CP-30-K', price: 69.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '32', color: 'Khaki', sku: 'CP-32-K', price: 69.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '34', color: 'Khaki', sku: 'CP-34-K', price: 69.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '36', color: 'Khaki', sku: 'CP-36-K', price: 69.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['pants', 'chino', 'casual'],
        seo: { title: 'Chino Pants - Brick Apparel', description: 'Shop our versatile chino pants.', keywords: ['pants', 'chino', 'casual'] },
      },
      {
        name: 'Leather Jacket',
        slug: 'leather-jacket',
        description: 'Classic leather jacket with a modern fit. Features a zippered front and multiple pockets.',
        shortDescription: 'Classic leather jacket',
        category: mensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
            alt: 'Leather Jacket',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Black', sku: 'LJ-S-B', price: 199.99, inventory: { quantity: 15, lowStockThreshold: 5 } },
          { size: 'M', color: 'Black', sku: 'LJ-M-B', price: 199.99, inventory: { quantity: 15, lowStockThreshold: 5 } },
          { size: 'L', color: 'Black', sku: 'LJ-L-B', price: 199.99, inventory: { quantity: 15, lowStockThreshold: 5 } },
          { size: 'XL', color: 'Black', sku: 'LJ-XL-B', price: 199.99, inventory: { quantity: 10, lowStockThreshold: 5 } },
        ],
        tags: ['jacket', 'leather', 'outerwear'],
        seo: { title: 'Leather Jacket - Brick Apparel', description: 'Shop our classic leather jacket.', keywords: ['jacket', 'leather', 'outerwear'] },
      },
      
      // Women's Clothing
      {
        name: 'Summer Dress',
        slug: 'summer-dress',
        description: 'Light and airy summer dress perfect for warm weather. Made from breathable fabric with a flattering fit.',
        shortDescription: 'Light summer dress',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
            alt: 'Summer Dress',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Floral', sku: 'SD-S-F', price: 59.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'M', color: 'Floral', sku: 'SD-M-F', price: 59.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'L', color: 'Floral', sku: 'SD-L-F', price: 59.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Floral', sku: 'SD-XL-F', price: 59.99, inventory: { quantity: 15, lowStockThreshold: 10 } },
        ],
        tags: ['dress', 'summer', 'floral'],
        seo: { title: 'Summer Dress - Brick Apparel', description: 'Shop our beautiful summer dress collection.', keywords: ['dress', 'summer', 'floral'] },
      },
      {
        name: 'Elegant Blouse',
        slug: 'elegant-blouse',
        description: 'Sophisticated blouse perfect for office or evening wear. Features delicate details and premium fabric.',
        shortDescription: 'Sophisticated blouse',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594633312681-425a7b4aa275?w=800&h=800&fit=crop',
            alt: 'Elegant Blouse',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'White', sku: 'EB-S-W', price: 54.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'M', color: 'White', sku: 'EB-M-W', price: 54.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'L', color: 'White', sku: 'EB-L-W', price: 54.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'XL', color: 'White', sku: 'EB-XL-W', price: 54.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['blouse', 'formal', 'elegant'],
        seo: { title: 'Elegant Blouse - Brick Apparel', description: 'Shop our sophisticated blouse collection.', keywords: ['blouse', 'formal', 'elegant'] },
      },
      {
        name: 'High-Waisted Jeans',
        slug: 'high-waisted-jeans',
        description: 'Flattering high-waisted jeans with a slim fit. Made from premium denim with stretch for comfort.',
        shortDescription: 'Flattering high-waisted jeans',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
            alt: 'High-Waisted Jeans',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '26', color: 'Blue', sku: 'HWJ-26-B', price: 89.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '28', color: 'Blue', sku: 'HWJ-28-B', price: 89.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '30', color: 'Blue', sku: 'HWJ-30-B', price: 89.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '32', color: 'Blue', sku: 'HWJ-32-B', price: 89.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['jeans', 'denim', 'casual'],
        seo: { title: 'High-Waisted Jeans - Brick Apparel', description: 'Shop our flattering high-waisted jeans.', keywords: ['jeans', 'denim', 'casual'] },
      },
      {
        name: 'Knit Sweater',
        slug: 'knit-sweater',
        description: 'Cozy knit sweater perfect for fall and winter. Features a relaxed fit and soft texture.',
        shortDescription: 'Cozy knit sweater',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
            alt: 'Knit Sweater',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Beige', sku: 'KS-S-B', price: 64.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'M', color: 'Beige', sku: 'KS-M-B', price: 64.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'L', color: 'Beige', sku: 'KS-L-B', price: 64.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Beige', sku: 'KS-XL-B', price: 64.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['sweater', 'knit', 'warm'],
        seo: { title: 'Knit Sweater - Brick Apparel', description: 'Shop our cozy knit sweater collection.', keywords: ['sweater', 'knit', 'warm'] },
      },
      {
        name: 'Midi Skirt',
        slug: 'midi-skirt',
        description: 'Elegant midi skirt with a flowing silhouette. Perfect for both casual and formal occasions.',
        shortDescription: 'Elegant midi skirt',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
            alt: 'Midi Skirt',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Black', sku: 'MS-S-B', price: 49.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'M', color: 'Black', sku: 'MS-M-B', price: 49.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'L', color: 'Black', sku: 'MS-L-B', price: 49.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Black', sku: 'MS-XL-B', price: 49.99, inventory: { quantity: 15, lowStockThreshold: 10 } },
        ],
        tags: ['skirt', 'midi', 'elegant'],
        seo: { title: 'Midi Skirt - Brick Apparel', description: 'Shop our elegant midi skirt collection.', keywords: ['skirt', 'midi', 'elegant'] },
      },
      {
        name: 'Casual T-Shirt',
        slug: 'casual-t-shirt-women',
        description: 'Comfortable and stylish t-shirt in soft cotton. Perfect for everyday wear.',
        shortDescription: 'Comfortable casual t-shirt',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
            alt: 'Casual T-Shirt',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Pink', sku: 'CTS-S-P', price: 34.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'M', color: 'Pink', sku: 'CTS-M-P', price: 34.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'L', color: 'Pink', sku: 'CTS-L-P', price: 34.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Pink', sku: 'CTS-XL-P', price: 34.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
        ],
        tags: ['t-shirt', 'casual', 'cotton'],
        seo: { title: 'Casual T-Shirt - Brick Apparel', description: 'Shop our comfortable casual t-shirt.', keywords: ['t-shirt', 'casual', 'cotton'] },
      },
      {
        name: 'Winter Coat',
        slug: 'winter-coat',
        description: 'Warm and stylish winter coat with a modern design. Features a hood and multiple pockets.',
        shortDescription: 'Warm winter coat',
        category: womensCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop',
            alt: 'Winter Coat',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Navy', sku: 'WC-S-N', price: 149.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: 'M', color: 'Navy', sku: 'WC-M-N', price: 149.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: 'L', color: 'Navy', sku: 'WC-L-N', price: 149.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: 'XL', color: 'Navy', sku: 'WC-XL-N', price: 149.99, inventory: { quantity: 15, lowStockThreshold: 5 } },
        ],
        tags: ['coat', 'winter', 'outerwear'],
        seo: { title: 'Winter Coat - Brick Apparel', description: 'Shop our warm winter coat collection.', keywords: ['coat', 'winter', 'outerwear'] },
      },
      
      // Shoes
      {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Comfortable and stylish sneakers perfect for everyday wear. Features cushioned insoles and durable soles.',
        shortDescription: 'Comfortable sneakers',
        category: shoesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            alt: 'Sneakers',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '7', color: 'White', sku: 'SN-7-W', price: 89.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '8', color: 'White', sku: 'SN-8-W', price: 89.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '9', color: 'White', sku: 'SN-9-W', price: 89.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '10', color: 'White', sku: 'SN-10-W', price: 89.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '11', color: 'White', sku: 'SN-11-W', price: 89.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
        ],
        tags: ['sneakers', 'shoes', 'casual'],
        seo: { title: 'Sneakers - Brick Apparel', description: 'Shop our comfortable sneakers.', keywords: ['sneakers', 'shoes', 'casual'] },
      },
      {
        name: 'Leather Boots',
        slug: 'leather-boots',
        description: 'Classic leather boots with a timeless design. Perfect for both casual and semi-formal occasions.',
        shortDescription: 'Classic leather boots',
        category: shoesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop',
            alt: 'Leather Boots',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '7', color: 'Brown', sku: 'LB-7-BR', price: 129.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: '8', color: 'Brown', sku: 'LB-8-BR', price: 129.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: '9', color: 'Brown', sku: 'LB-9-BR', price: 129.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: '10', color: 'Brown', sku: 'LB-10-BR', price: 129.99, inventory: { quantity: 20, lowStockThreshold: 5 } },
          { size: '11', color: 'Brown', sku: 'LB-11-BR', price: 129.99, inventory: { quantity: 15, lowStockThreshold: 5 } },
        ],
        tags: ['boots', 'leather', 'formal'],
        seo: { title: 'Leather Boots - Brick Apparel', description: 'Shop our classic leather boots.', keywords: ['boots', 'leather', 'formal'] },
      },
      {
        name: 'High Heels',
        slug: 'high-heels',
        description: 'Elegant high heels perfect for special occasions. Features a comfortable heel height and stylish design.',
        shortDescription: 'Elegant high heels',
        category: shoesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
            alt: 'High Heels',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '6', color: 'Black', sku: 'HH-6-B', price: 79.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '7', color: 'Black', sku: 'HH-7-B', price: 79.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '8', color: 'Black', sku: 'HH-8-B', price: 79.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
          { size: '9', color: 'Black', sku: 'HH-9-B', price: 79.99, inventory: { quantity: 20, lowStockThreshold: 10 } },
        ],
        tags: ['heels', 'formal', 'elegant'],
        seo: { title: 'High Heels - Brick Apparel', description: 'Shop our elegant high heels.', keywords: ['heels', 'formal', 'elegant'] },
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'High-performance running shoes with advanced cushioning and breathable mesh upper.',
        shortDescription: 'High-performance running shoes',
        category: shoesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            alt: 'Running Shoes',
            isPrimary: true,
          },
        ],
        variants: [
          { size: '7', color: 'Blue', sku: 'RS-7-BL', price: 99.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '8', color: 'Blue', sku: 'RS-8-BL', price: 99.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '9', color: 'Blue', sku: 'RS-9-BL', price: 99.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '10', color: 'Blue', sku: 'RS-10-BL', price: 99.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: '11', color: 'Blue', sku: 'RS-11-BL', price: 99.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
        ],
        tags: ['running', 'sports', 'athletic'],
        seo: { title: 'Running Shoes - Brick Apparel', description: 'Shop our high-performance running shoes.', keywords: ['running', 'sports', 'athletic'] },
      },
      
      // Accessories
      {
        name: 'Leather Belt',
        slug: 'leather-belt',
        description: 'Classic leather belt with a timeless buckle design. Made from genuine leather.',
        shortDescription: 'Classic leather belt',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            alt: 'Leather Belt',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'S', color: 'Brown', sku: 'LB-S-BR', price: 39.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'M', color: 'Brown', sku: 'LB-M-BR', price: 39.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'L', color: 'Brown', sku: 'LB-L-BR', price: 39.99, inventory: { quantity: 50, lowStockThreshold: 10 } },
          { size: 'XL', color: 'Brown', sku: 'LB-XL-BR', price: 39.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
        ],
        tags: ['belt', 'leather', 'accessory'],
        seo: { title: 'Leather Belt - Brick Apparel', description: 'Shop our classic leather belt.', keywords: ['belt', 'leather', 'accessory'] },
      },
      {
        name: 'Designer Handbag',
        slug: 'designer-handbag',
        description: 'Stylish designer handbag with multiple compartments. Perfect for everyday use.',
        shortDescription: 'Stylish designer handbag',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
            alt: 'Designer Handbag',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'One Size', color: 'Black', sku: 'DH-OS-B', price: 119.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'One Size', color: 'Brown', sku: 'DH-OS-BR', price: 119.99, inventory: { quantity: 30, lowStockThreshold: 10 } },
          { size: 'One Size', color: 'Beige', sku: 'DH-OS-BE', price: 119.99, inventory: { quantity: 25, lowStockThreshold: 10 } },
        ],
        tags: ['handbag', 'bag', 'accessory'],
        seo: { title: 'Designer Handbag - Brick Apparel', description: 'Shop our stylish designer handbag.', keywords: ['handbag', 'bag', 'accessory'] },
      },
      {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Stylish sunglasses with UV protection. Features a modern frame design.',
        shortDescription: 'Stylish sunglasses',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop',
            alt: 'Sunglasses',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'One Size', color: 'Black', sku: 'SG-OS-B', price: 49.99, inventory: { quantity: 60, lowStockThreshold: 15 } },
          { size: 'One Size', color: 'Brown', sku: 'SG-OS-BR', price: 49.99, inventory: { quantity: 60, lowStockThreshold: 15 } },
          { size: 'One Size', color: 'Blue', sku: 'SG-OS-BL', price: 49.99, inventory: { quantity: 50, lowStockThreshold: 15 } },
        ],
        tags: ['sunglasses', 'accessory', 'eyewear'],
        seo: { title: 'Sunglasses - Brick Apparel', description: 'Shop our stylish sunglasses.', keywords: ['sunglasses', 'accessory', 'eyewear'] },
      },
      {
        name: 'Wristwatch',
        slug: 'wristwatch',
        description: 'Elegant wristwatch with a classic design. Features a leather strap and precise movement.',
        shortDescription: 'Elegant wristwatch',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
            alt: 'Wristwatch',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'One Size', color: 'Silver', sku: 'WW-OS-S', price: 149.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'One Size', color: 'Gold', sku: 'WW-OS-G', price: 149.99, inventory: { quantity: 40, lowStockThreshold: 10 } },
          { size: 'One Size', color: 'Rose Gold', sku: 'WW-OS-RG', price: 149.99, inventory: { quantity: 35, lowStockThreshold: 10 } },
        ],
        tags: ['watch', 'accessory', 'timepiece'],
        seo: { title: 'Wristwatch - Brick Apparel', description: 'Shop our elegant wristwatch.', keywords: ['watch', 'accessory', 'timepiece'] },
      },
      {
        name: 'Baseball Cap',
        slug: 'baseball-cap',
        description: 'Classic baseball cap with an adjustable strap. Perfect for casual wear.',
        shortDescription: 'Classic baseball cap',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop',
            alt: 'Baseball Cap',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'One Size', color: 'Black', sku: 'BC-OS-B', price: 24.99, inventory: { quantity: 80, lowStockThreshold: 20 } },
          { size: 'One Size', color: 'Navy', sku: 'BC-OS-N', price: 24.99, inventory: { quantity: 80, lowStockThreshold: 20 } },
          { size: 'One Size', color: 'Gray', sku: 'BC-OS-G', price: 24.99, inventory: { quantity: 70, lowStockThreshold: 20 } },
        ],
        tags: ['cap', 'hat', 'accessory'],
        seo: { title: 'Baseball Cap - Brick Apparel', description: 'Shop our classic baseball cap.', keywords: ['cap', 'hat', 'accessory'] },
      },
      {
        name: 'Scarf',
        slug: 'scarf',
        description: 'Soft and warm scarf perfect for cold weather. Made from premium materials.',
        shortDescription: 'Soft and warm scarf',
        category: accessoriesCategory._id,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
            alt: 'Scarf',
            isPrimary: true,
          },
        ],
        variants: [
          { size: 'One Size', color: 'Red', sku: 'SC-OS-R', price: 34.99, inventory: { quantity: 50, lowStockThreshold: 15 } },
          { size: 'One Size', color: 'Blue', sku: 'SC-OS-BL', price: 34.99, inventory: { quantity: 50, lowStockThreshold: 15 } },
          { size: 'One Size', color: 'Gray', sku: 'SC-OS-G', price: 34.99, inventory: { quantity: 50, lowStockThreshold: 15 } },
        ],
        tags: ['scarf', 'accessory', 'warm'],
        seo: { title: 'Scarf - Brick Apparel', description: 'Shop our soft and warm scarf.', keywords: ['scarf', 'accessory', 'warm'] },
      },
    ]

    for (const productData of products) {
      await Product.create(productData)
    }

    // Create homepage content blocks
    await ContentBlock.create({
      type: 'banner',
      title: 'Welcome to Brick Apparel',
      content: {
        title: 'Welcome to Brick Apparel',
        description: 'Discover premium clothing for the modern lifestyle. Shop the latest trends and timeless classics.',
        ctaText: 'Shop Now',
        ctaLink: '/products',
      },
      order: 1,
      isActive: true,
    })

    // Create admin user
    await AdminUser.create({
      email: 'admin@brickapparel.com',
      password: 'admin123', // Will be hashed by pre-save hook
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: {
        products: { create: true, update: true, delete: true },
        orders: { view: true, update: true, refund: true },
        inventory: { view: true, update: true },
        content: { view: true, update: true },
      },
    })

    console.log('Seed data created successfully!')
    console.log('Admin credentials:')
    console.log('Email: admin@brickapparel.com')
    console.log('Password: admin123')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()

