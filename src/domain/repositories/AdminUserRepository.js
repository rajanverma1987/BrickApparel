import AdminUser from '../models/AdminUser'

class AdminUserRepository {
  async create(data) {
    return await AdminUser.create(data)
  }

  async findById(id) {
    return await AdminUser.findById(id).select('-password')
  }

  async findByEmail(email) {
    return await AdminUser.findOne({ email: email.toLowerCase() })
  }

  async findAll(filters = {}) {
    return await AdminUser.find(filters).select('-password').sort({ createdAt: -1 })
  }

  async update(id, data) {
    if (data.password) {
      // Password will be hashed by pre-save hook
    }
    return await AdminUser.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return await AdminUser.findByIdAndUpdate(id, { isActive: false }, { new: true })
  }
}

export default new AdminUserRepository()

