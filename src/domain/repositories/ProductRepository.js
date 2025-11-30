import Product from '../models/Product'
import Category from '../models/Category' // Ensure Category model is registered

class ProductRepository {
  async create(data) {
    return await Product.create(data)
  }

  async findById(id) {
    return await Product.findById(id).populate('category')
  }

  async findBySlug(slug) {
    return await Product.findOne({ slug, isActive: true }).populate('category')
  }

  async findAll(filters = {}, options = {}) {
    const query = { isActive: true, ...filters }
    let mongooseQuery = Product.find(query).populate('category').sort({ createdAt: -1 })
    
    if (options.limit) {
      mongooseQuery = mongooseQuery.limit(options.limit)
    }
    
    return await mongooseQuery
  }

  async search(searchTerm, filters = {}) {
    const query = {
      isActive: true,
      $text: { $search: searchTerm },
      ...filters,
    }
    return await Product.find(query)
      .populate('category')
      .sort({ score: { $meta: 'textScore' } })
  }

  async findByCategory(categoryId, filters = {}) {
    const query = { category: categoryId, isActive: true, ...filters }
    return await Product.find(query).populate('category').sort({ createdAt: -1 })
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }

  async findVariantBySku(sku) {
    const product = await Product.findOne({ 'variants.sku': sku })
    if (!product) return null
    
    const variant = product.variants.find(v => v.sku === sku)
    return { product, variant }
  }

  async updateVariantInventory(sku, quantity) {
    return await Product.findOneAndUpdate(
      { 'variants.sku': sku },
      { $inc: { 'variants.$.inventory.quantity': quantity } },
      { new: true }
    )
  }

  async incrementViews(productId) {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.views': 1 } },
      { new: true }
    )
  }

  async incrementConversions(productId) {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.conversions': 1 } },
      { new: true }
    )
  }
}

export default new ProductRepository()

