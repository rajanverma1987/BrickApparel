import Cart from '../models/Cart'

class CartRepository {
  async findBySessionId(sessionId) {
    return await Cart.findOne({ sessionId }).populate('items.product')
  }

  async findByCustomerId(customerId) {
    return await Cart.findOne({ customerId }).populate('items.product')
  }

  async create(data) {
    return await Cart.create(data)
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async addItem(sessionId, item) {
    const cart = await Cart.findOne({ sessionId })
    if (!cart) {
      return await Cart.create({
        sessionId,
        items: [item],
      })
    }

    const existingItemIndex = cart.items.findIndex(
      (i) =>
        i.product.toString() === item.product.toString() &&
        i.variant.sku === item.variant.sku
    )

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += item.quantity
    } else {
      cart.items.push(item)
    }

    return await cart.save()
  }

  async updateItemQuantity(sessionId, itemIndex, quantity) {
    const cart = await Cart.findOne({ sessionId })
    if (!cart || !cart.items[itemIndex]) return null

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    return await cart.save()
  }

  async removeItem(sessionId, itemIndex) {
    const cart = await Cart.findOne({ sessionId })
    if (!cart || !cart.items[itemIndex]) return null

    cart.items.splice(itemIndex, 1)
    return await cart.save()
  }

  async clearCart(sessionId) {
    return await Cart.findOneAndUpdate(
      { sessionId },
      { items: [] },
      { new: true }
    )
  }

  async mergeCarts(sessionId, customerId) {
    const sessionCart = await Cart.findOne({ sessionId })
    const customerCart = await Cart.findOne({ customerId })

    if (!sessionCart) return customerCart
    if (!customerCart) {
      sessionCart.customerId = customerId
      return await sessionCart.save()
    }

    // Merge items
    sessionCart.items.forEach((item) => {
      const existingItemIndex = customerCart.items.findIndex(
        (i) =>
          i.product.toString() === item.product.toString() &&
          i.variant.sku === item.variant.sku
      )

      if (existingItemIndex >= 0) {
        customerCart.items[existingItemIndex].quantity += item.quantity
      } else {
        customerCart.items.push(item)
      }
    })

    await Cart.deleteOne({ _id: sessionCart._id })
    customerCart.customerId = customerId
    return await customerCart.save()
  }
}

export default new CartRepository()

