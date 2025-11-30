import ContentBlock from '../models/ContentBlock'

class ContentBlockRepository {
  async create(data) {
    return await ContentBlock.create(data)
  }

  async findById(id) {
    return await ContentBlock.findById(id)
  }

  async findAll(filters = {}) {
    const query = { isActive: true, ...filters }
    return await ContentBlock.find(query).sort({ order: 1 })
  }

  async findByType(type) {
    return await ContentBlock.find({ type, isActive: true }).sort({ order: 1 })
  }

  async update(id, data) {
    return await ContentBlock.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return await ContentBlock.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }
}

export default new ContentBlockRepository()

