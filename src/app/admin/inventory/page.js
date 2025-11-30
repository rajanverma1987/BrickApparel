import connectDB from '../../../lib/db/mongoose'
import productRepository from '../../../domain/repositories/ProductRepository'
import inventoryService from '../../../domain/services/InventoryService'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import InventoryForm from '../../../components/admin/InventoryForm'
import InventoryTable from '../../../components/admin/InventoryTable'

async function updateInventoryAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const sku = formData.get('sku')
    const quantity = parseInt(formData.get('quantity'))
    
    if (!sku || isNaN(quantity)) {
      return { success: false, error: 'Invalid SKU or quantity' }
    }
    
    await inventoryService.updateInventory(sku, quantity)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminInventoryPage() {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../domain/models/Category')
  await import('../../../domain/models/Product')

  const products = await productRepository.findAll({})
  const productsData = products.map(p => JSON.parse(JSON.stringify(p)))

  // Get low stock items
  const lowStockItems = []
  productsData.forEach(product => {
    product.variants?.forEach(variant => {
      const stock = variant.inventory?.quantity || 0
      const threshold = variant.inventory?.lowStockThreshold || 10
      if (stock <= threshold) {
        lowStockItems.push({
          productName: product.name,
          productId: product._id,
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          stock,
          threshold,
        })
      }
    })
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                Low Stock Alert
              </h2>
              <p className="text-yellow-700">
                {lowStockItems.length} variant{lowStockItems.length !== 1 ? 's' : ''} below threshold
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Products:</span>
              <span className="font-semibold">{productsData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Variants:</span>
              <span className="font-semibold">
                {productsData.reduce((sum, p) => sum + (p.variants?.length || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Stock Items:</span>
              <span className="font-semibold text-yellow-600">{lowStockItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Out of Stock:</span>
              <span className="font-semibold text-red-600">
                {productsData.reduce((sum, p) => {
                  return sum + (p.variants?.filter(v => (v.inventory?.quantity || 0) === 0).length || 0)
                }, 0)}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Update Inventory</h2>
          <InventoryForm action={updateInventoryAction} />
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">All Products Inventory</h2>
        <InventoryTable products={productsData} />
      </Card>
    </div>
  )
}

