import Guest from '../models/Guest'

class GuestRepository {
  async create(data) {
    return await Guest.create(data)
  }

  async findById(id) {
    return await Guest.findById(id)
  }

  async findByEmail(email) {
    return await Guest.findOne({ email: email.toLowerCase() })
  }

  async findOrCreate(email, data = {}) {
    let guest = await Guest.findOne({ email: email.toLowerCase() })
    if (!guest) {
      guest = await Guest.create({ email: email.toLowerCase(), ...data })
    }
    return guest
  }
}

export default new GuestRepository()

