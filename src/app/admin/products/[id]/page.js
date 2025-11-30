import connectDB from '../../../../lib/db/mongoose'
import productRepository from '../../../../domain/repositories/ProductRepository'
import categoryRepository from '../../../../domain/repositories/CategoryRepository'
import productService from '../../../../domain/services/ProductService'
import { getAdminSession } from '../../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import AddVariantForm from '../../../../components/admin/AddVariantForm'
import ColorPicker from '../../../../components/admin/ColorPicker'
import DeleteForm from '../../../../components/admin/DeleteForm'
import ImageUpload from '../../../../components/admin/ImageUpload'

async function updateProductAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const productId = formData.get('productId')
    const name = formData.get('name')
    const description = formData.get('description')
    const shortDescription = formData.get('shortDescription')
    const category = formData.get('category')
    const isActive = formData.get('isActive') === 'on'
    
    await productService.updateProduct(productId, {
      name,
      description,
      shortDescription,
      category,
      isActive,
    })
    
    redirect(`/admin/products?toast=1&type=success&message=${encodeURIComponent(`Product "${name}" updated successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteProductAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const productId = formData.get('productId')
    const product = await productRepository.findById(productId)
    const productName = product?.name || 'Product'
    
    await productService.deleteProduct(productId)
    
    redirect(`/admin/products?toast=1&type=success&message=${encodeURIComponent(`Product "${productName}" deleted successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function addVariantAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const productId = formData.get('productId')
    const size = formData.get('size')
    const color = formData.get('color')
    const colorHex = formData.get('colorHex') || '#CCCCCC'
    const price = parseFloat(formData.get('price'))
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null
    const quantity = parseInt(formData.get('quantity') || '0')
    const lowStockThreshold = parseInt(formData.get('lowStockThreshold') || '10')
    
    // Parse variant images
    const imageUrls = formData.get('imageUrls')?.split('\n').filter(url => url.trim()) || []
    const variantImages = imageUrls.map((url, index) => ({
      url: url.trim(),
      alt: `${size} ${color} - Image ${index + 1}`,
      isPrimary: index === 0,
    }))
    
    const product = await productRepository.findById(productId)
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    
    // Generate SKU: product-slug-size-color
    const sku = `${product.slug}-${size.toLowerCase()}-${color.toLowerCase()}`.replace(/\s+/g, '-')
    
    // Check if variant with this SKU already exists
    const existingVariant = product.variants.find(v => v.sku === sku)
    if (existingVariant) {
      return { success: false, error: 'Variant with this size and color already exists' }
    }
    
    const newVariant = {
      size,
      color,
      colorHex,
      sku,
      price,
      compareAtPrice,
      inventory: {
        quantity,
        lowStockThreshold,
      },
      images: variantImages,
    }
    
    product.variants.push(newVariant)
    await product.save()
    
    redirect(`/admin/products/${productId}?toast=1&type=success&message=${encodeURIComponent(`Variant (${size} / ${color}) added successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function updateVariantAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const productId = formData.get('productId')
    const variantIndex = parseInt(formData.get('variantIndex'))
    const size = formData.get('size')
    const color = formData.get('color')
    const colorHex = formData.get('colorHex') || '#CCCCCC'
    const price = parseFloat(formData.get('price'))
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null
    const quantity = parseInt(formData.get('quantity') || '0')
    const lowStockThreshold = parseInt(formData.get('lowStockThreshold') || '10')
    
    // Parse variant images
    const imageUrls = formData.get('imageUrls')?.split('\n').filter(url => url.trim()) || []
    const variantImages = imageUrls.map((url, index) => ({
      url: url.trim(),
      alt: `${size} ${color} - Image ${index + 1}`,
      isPrimary: index === 0,
    }))
    
    const product = await productRepository.findById(productId)
    if (!product || !product.variants[variantIndex]) {
      return { success: false, error: 'Product or variant not found' }
    }
    
    // Generate new SKU
    const sku = `${product.slug}-${size.toLowerCase()}-${color.toLowerCase()}`.replace(/\s+/g, '-')
    
    // Check if another variant with this SKU exists (excluding current variant)
    const existingVariant = product.variants.find((v, idx) => v.sku === sku && idx !== variantIndex)
    if (existingVariant) {
      return { success: false, error: 'Another variant with this size and color already exists' }
    }
    
    product.variants[variantIndex] = {
      size,
      color,
      colorHex,
      sku,
      price,
      compareAtPrice,
      inventory: {
        quantity,
        lowStockThreshold,
      },
      images: variantImages.length > 0 ? variantImages : product.variants[variantIndex].images || [],
    }
    
    await product.save()
    
    redirect(`/admin/products/${productId}?toast=1&type=success&message=${encodeURIComponent(`Variant (${size} / ${color}) updated successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteVariantAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const productId = formData.get('productId')
    const variantIndex = parseInt(formData.get('variantIndex'))
    
    const product = await productRepository.findById(productId)
    if (!product || !product.variants[variantIndex]) {
      return { success: false, error: 'Product or variant not found' }
    }
    
    const variant = product.variants[variantIndex]
    const variantInfo = `${variant.size} / ${variant.color}`
    product.variants.splice(variantIndex, 1)
    await product.save()
    
    redirect(`/admin/products/${productId}?toast=1&type=success&message=${encodeURIComponent(`Variant (${variantInfo}) deleted successfully`)}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminProductEditPage({ params }) {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  // Redirect if trying to access "new" as an ID
  if (params.id === 'new') {
    redirect('/admin/products/new')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Category')
  await import('../../../../domain/models/Product')

  let product
  try {
    product = await productRepository.findById(params.id)
    if (!product) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      )
    }
    product = JSON.parse(JSON.stringify(product))
  } catch (error) {
    redirect(`/admin/products?toast=1&type=error&message=${encodeURIComponent(error.message || 'Product not found')}`)
  }

  const categories = await categoryRepository.findAll()
  const categoriesData = categories.map(c => JSON.parse(JSON.stringify(c)))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/products" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form action={updateProductAction} className="space-y-6">
              <input type="hidden" name="productId" value={product._id.toString()} />
              
              <div>
                <Input
                  label="Product Name"
                  name="name"
                  defaultValue={product.name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={8}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <Input
                  label="Short Description"
                  name="shortDescription"
                  defaultValue={product.shortDescription || ''}
                  placeholder="Brief description for product cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={product.category?._id?.toString() || product.category}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
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
                    defaultChecked={product.isActive}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save Changes</Button>
                <Link href="/admin/products">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>

          {/* Variants Section */}
          <Card className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Variants</h2>
            </div>
            
            {/* Add New Variant Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold mb-3">Add New Variant</h3>
              <AddVariantForm productId={product._id.toString()} addVariantAction={addVariantAction} />
            </div>

            {/* Existing Variants Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compare At</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((variant, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{variant.size}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: variant.colorHex || '#CCCCCC' }}
                              title={variant.color}
                            />
                            <span>{variant.color}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{variant.sku}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${variant.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {variant.compareAtPrice ? `$${variant.compareAtPrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {variant.inventory?.quantity || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <details className="relative">
                            <summary className="cursor-pointer text-primary-600 hover:text-primary-800 font-medium" style={{ listStyle: 'none' }}>
                              Edit
                            </summary>
                            <div className="absolute right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-96 max-h-[600px] overflow-y-auto">
                              <form action={updateVariantAction} className="space-y-3">
                                <input type="hidden" name="productId" value={product._id.toString()} />
                                <input type="hidden" name="variantIndex" value={index} />
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                  <input
                                    type="text"
                                    name="size"
                                    defaultValue={variant.size}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Color Name</label>
                                  <input
                                    type="text"
                                    name="color"
                                    defaultValue={variant.color}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                  <ColorPicker
                                    name="colorHex"
                                    defaultValue={variant.colorHex || '#CCCCCC'}
                                    id={`colorHex-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
                                  <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    defaultValue={variant.price}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Compare At Price ($)</label>
                                  <input
                                    type="number"
                                    name="compareAtPrice"
                                    step="0.01"
                                    min="0"
                                    defaultValue={variant.compareAtPrice || ''}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                  <input
                                    type="number"
                                    name="quantity"
                                    min="0"
                                    defaultValue={variant.inventory?.quantity || 0}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                                  <input
                                    type="number"
                                    name="lowStockThreshold"
                                    min="0"
                                    defaultValue={variant.inventory?.lowStockThreshold || 10}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Variant Images</label>
                                  <ImageUpload 
                                    name="imageUrls"
                                    defaultValue={variant.images?.map(img => img.url).join('\n') || ''}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit" size="sm" className="flex-1">Save</Button>
                                  <div className="flex-1">
                                    <DeleteForm
                                      action={deleteVariantAction}
                                      confirmMessage={`Are you sure you want to delete this variant (${variant.size} / ${variant.color})? This action cannot be undone.`}
                                      variant="danger"
                                      size="sm"
                                      className="w-full"
                                      hiddenFields={{
                                        productId: product._id.toString(),
                                        variantIndex: index.toString()
                                      }}
                                      successMessage={`Variant (${variant.size} / ${variant.color}) deleted successfully`}
                                      errorMessage="Failed to delete variant"
                                    >
                                      Delete
                                    </DeleteForm>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </details>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        No variants yet. Add your first variant above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Product Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Slug:</span>
                <p className="text-gray-900">{product.slug}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Updated:</span>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Total Variants:</span>
                <p className="text-gray-900">{product.variants?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="mt-6 border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Deleting a product will mark it as inactive. This action cannot be undone.
            </p>
            <DeleteForm
              action={deleteProductAction}
              confirmMessage={`Are you sure you want to delete "${product.name}"? This will mark the product as inactive and cannot be undone.`}
              variant="danger"
              className="w-full"
              hiddenFields={{
                productId: product._id.toString()
              }}
              successMessage={`Product "${product.name}" deleted successfully`}
              errorMessage="Failed to delete product"
            >
              Delete Product
            </DeleteForm>
          </Card>
        </div>
      </div>
    </div>
  )
}

