import Customer from '../models/Customer'

class CustomerRepository {
  async create(data) {
    return await Customer.create(data)
  }

  async findById(id) {
    return await Customer.findById(id)
  }

  async findByEmail(email) {
    return await Customer.findOne({ email: email.toLowerCase() })
  }

  async update(id, data) {
    return await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async addAddress(customerId, address) {
    const customer = await Customer.findById(customerId)
    if (!customer) return null

    if (address.isDefault) {
      customer.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    customer.addresses.push(address)
    return await customer.save()
  }

  async updateAddress(customerId, addressId, addressData) {
    const customer = await Customer.findById(customerId)
    if (!customer) return null

    const address = customer.addresses.id(addressId)
    if (!address) return null

    if (addressData.isDefault) {
      customer.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    Object.assign(address, addressData)
    return await customer.save()
  }

  async deleteAddress(customerId, addressId) {
    const customer = await Customer.findById(customerId)
    if (!customer) return null

    customer.addresses.id(addressId).deleteOne()
    return await customer.save()
  }
}

export default new CustomerRepository()

