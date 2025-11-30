import cartRepository from '../repositories/CartRepository'
import productService from './ProductService'

class CartService {
  async getOrCreateCart(sessionId, customerId = null) {
    let cart = customerId
      ? await cartRepository.findByCustomerId(customerId)
      : await cartRepository.findBySessionId(sessionId)

    if (!cart) {
      cart = await cartRepository.create({
        sessionId,
        customerId: customerId || null,
        items: [],
      })
    }

    return cart
  }

  async addToCart(sessionId, productId, variant, quantity, customerId = null) {
    // Check inventory
    await productService.checkInventory(variant.sku, quantity)

    // Get product for price
    const product = await productService.getProduct(productId)
    const productVariant = product.variants.find((v) => v.sku === variant.sku)

    if (!productVariant) {
      throw new Error('Variant not found')
    }

    const cartItem = {
      product: productId,
      variant: {
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
      },
      quantity,
      price: productVariant.price,
    }

    return await cartRepository.addItem(sessionId, cartItem)
  }

  async updateCartItem(sessionId, itemIndex, quantity, customerId = null) {
    const cart = await this.getOrCreateCart(sessionId, customerId)

    if (quantity > 0) {
      const item = cart.items[itemIndex]
      if (item) {
        // Check inventory for new quantity
        await productService.checkInventory(item.variant.sku, quantity)
      }
    }

    return await cartRepository.updateItemQuantity(sessionId, itemIndex, quantity)
  }

  async removeFromCart(sessionId, itemIndex, customerId = null) {
    return await cartRepository.removeItem(sessionId, itemIndex)
  }

  async getCart(sessionId, customerId = null) {
    return await this.getOrCreateCart(sessionId, customerId)
  }

  async clearCart(sessionId, customerId = null) {
    if (customerId) {
      const cart = await cartRepository.findByCustomerId(customerId)
      if (cart) {
        return await cartRepository.clearCart(cart.sessionId)
      }
    }
    return await cartRepository.clearCart(sessionId)
  }

  async mergeCarts(sessionId, customerId) {
    return await cartRepository.mergeCarts(sessionId, customerId)
  }

  calculateCartTotal(cart) {
    if (!cart || !cart.items) return { subtotal: 0, total: 0, itemCount: 0 }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    return {
      subtotal,
      total: subtotal, // Shipping and tax calculated at checkout
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    }
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }
}

export default new CartService()

