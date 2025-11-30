import connectDB from '../../../../lib/db/mongoose'
import categoryRepository from '../../../../domain/repositories/CategoryRepository'
import productService from '../../../../domain/services/ProductService'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import { getAdminSession } from '../../../../lib/auth/admin-auth'
import ProductForm from '../../../../components/admin/ProductForm'

async function createProductAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const name = formData.get('name')
    const description = formData.get('description')
    const shortDescription = formData.get('shortDescription')
    const category = formData.get('category')
    const isActive = formData.get('isActive') === 'on'
    
    // Create product with minimal data (variants can be added after)
    const product = await productService.createProduct({
      name,
      description,
      shortDescription,
      category,
      isActive,
      variants: [], // Start with no variants
      images: [], // Start with no images
    })
    
    redirect(`/admin/products/${product._id}?toast=1&type=success&message=${encodeURIComponent(`Product "${name}" created successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminNewProductPage() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Category')
  await import('../../../../domain/models/Product')

  const categories = await categoryRepository.findAll()
  const categoriesData = categories.map(c => JSON.parse(JSON.stringify(c)))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/products" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold">Add New Product</h1>
        </div>
      </div>

      <Card>
        <ProductForm action={createProductAction} successMessage="Product created successfully">
          <div>
            <Input
              label="Product Name"
              name="name"
              required
              placeholder="e.g., Classic T-Shirt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={8}
              required
              placeholder="Detailed product description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <Input
              label="Short Description"
              name="shortDescription"
              placeholder="Brief description for product cards (max 200 chars)"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categoriesData.map(cat => (
                <option key={cat._id.toString()} value={cat._id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={true}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              You can add variants and images after creating the product.
            </p>
          </div>
        </ProductForm>
        <div className="mt-4">
          <Link href="/admin/products">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

