import productRepository from '../repositories/ProductRepository'
import orderRepository from '../repositories/OrderRepository'
import notificationRepository from '../repositories/NotificationRepository'

class InventoryService {
  async adjustInventoryOnOrder(order) {
    const adjustments = []

    for (const item of order.items) {
      const sku = item.variant.sku
      const quantity = -item.quantity // Negative because we're reducing inventory

      try {
        await productRepository.updateVariantInventory(sku, quantity)
        adjustments.push({ sku, quantity, success: true })
      } catch (error) {
        adjustments.push({ sku, quantity, success: false, error: error.message })
      }
    }

    return adjustments
  }

  async checkLowStock() {
    const products = await productRepository.findAll()
    const lowStockItems = []

    for (const product of products) {
      for (const variant of product.variants) {
        if (
          variant.inventory.quantity <= variant.inventory.lowStockThreshold &&
          variant.inventory.quantity > 0
        ) {
          lowStockItems.push({
            productId: product._id,
            productName: product.name,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            currentStock: variant.inventory.quantity,
            threshold: variant.inventory.lowStockThreshold,
          })

          // Create notification if not already created recently
          await this.createLowStockNotification(product._id, variant)
        }
      }
    }

    return lowStockItems
  }

  async createLowStockNotification(productId, variant) {
    // Check if notification already exists for this product/variant
    const existing = await notificationRepository.findAll({
      type: 'low_stock',
      product: productId,
      isRead: false,
    })

    if (existing.length === 0) {
      await notificationRepository.create({
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `Product variant ${variant.sku} (${variant.size}, ${variant.color}) is running low. Current stock: ${variant.inventory.quantity}`,
        product: productId,
      })
    }
  }

  async updateInventory(sku, quantity) {
    const result = await productRepository.findVariantBySku(sku)
    if (!result) {
      throw new Error('Variant not found')
    }

    return await productRepository.updateVariantInventory(sku, quantity)
  }

  async bulkUpdateInventory(updates) {
    const results = []

    for (const update of updates) {
      try {
        const result = await this.updateInventory(update.sku, update.quantity)
        results.push({ sku: update.sku, success: true, result })
      } catch (error) {
        results.push({ sku: update.sku, success: false, error: error.message })
      }
    }

    return results
  }

  async restoreInventoryOnRefund(order) {
    const adjustments = []

    for (const item of order.items) {
      const sku = item.variant.sku
      const quantity = item.quantity // Positive because we're restoring inventory

      try {
        await productRepository.updateVariantInventory(sku, quantity)
        adjustments.push({ sku, quantity, success: true })
      } catch (error) {
        adjustments.push({ sku, quantity, success: false, error: error.message })
      }
    }

    return adjustments
  }
}

export default new InventoryService()

