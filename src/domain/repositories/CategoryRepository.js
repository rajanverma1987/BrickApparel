import Category from '../models/Category'

class CategoryRepository {
  async create(data) {
    return await Category.create(data)
  }

  async findById(id) {
    return await Category.findById(id)
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug, isActive: true })
  }

  async findAll(filters = {}) {
    const query = { isActive: true, ...filters }
    return await Category.find(query).sort({ name: 1 })
  }

  async findTopLevel() {
    return await Category.find({ parentId: null, isActive: true }).sort({ name: 1 })
  }

  async findByParent(parentId) {
    return await Category.find({ parentId, isActive: true }).sort({ name: 1 })
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }
}

export default new CategoryRepository()

