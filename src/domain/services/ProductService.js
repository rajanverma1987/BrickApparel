import productRepository from '../repositories/ProductRepository'
import categoryRepository from '../repositories/CategoryRepository'
import analyticsRepository from '../repositories/AnalyticsRepository'

class ProductService {
  async createProduct(data) {
    // Validate category exists
    const category = await categoryRepository.findById(data.category)
    if (!category) {
      throw new Error('Category not found')
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name)
    }

    // Ensure at least one primary image
    if (data.images && data.images.length > 0 && !data.images.some(img => img.isPrimary)) {
      data.images[0].isPrimary = true
    }

    return await productRepository.create(data)
  }

  async getProduct(id) {
    const product = await productRepository.findById(id)
    if (!product || !product.isActive) {
      throw new Error('Product not found')
    }
    return product
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug)
    if (!product) {
      throw new Error('Product not found')
    }
    
    // Increment view count
    await productRepository.incrementViews(product._id)
    
    // Record analytics
    await analyticsRepository.updateOrCreate(
      new Date(),
      product._id,
      { 'metrics.views': 1 }
    )

    return product
  }

  async searchProducts(searchTerm, filters = {}) {
    if (!searchTerm || searchTerm.trim() === '') {
      return await productRepository.findAll(filters)
    }
    return await productRepository.search(searchTerm, filters)
  }

  async getProductsByCategory(categoryId, filters = {}) {
    return await productRepository.findByCategory(categoryId, filters)
  }

  async updateProduct(id, data) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }

    // If category is being updated, validate it exists
    if (data.category) {
      const category = await categoryRepository.findById(data.category)
      if (!category) {
        throw new Error('Category not found')
      }
    }

    // Generate slug if name changed
    if (data.name && data.name !== product.name) {
      data.slug = this.generateSlug(data.name)
    }

    return await productRepository.update(id, data)
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }
    return await productRepository.delete(id)
  }

  async getVariantBySku(sku) {
    const result = await productRepository.findVariantBySku(sku)
    if (!result) {
      throw new Error('Variant not found')
    }
    return result
  }

  async checkInventory(sku, quantity) {
    const { product, variant } = await this.getVariantBySku(sku)
    
    if (!variant || !variant.inventory) {
      throw new Error('Variant inventory not found')
    }

    if (variant.inventory.quantity < quantity) {
      throw new Error(`Insufficient inventory. Available: ${variant.inventory.quantity}`)
    }

    return { product, variant, available: variant.inventory.quantity }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

export default new ProductService()

