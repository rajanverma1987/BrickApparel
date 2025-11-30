import connectDB from '../../../lib/db/mongoose'
import categoryRepository from '../../../domain/repositories/CategoryRepository'
import productRepository from '../../../domain/repositories/ProductRepository'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import CategoryForm from '../../../components/admin/CategoryForm'

async function createCategoryAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const name = formData.get('name')
    const description = formData.get('description')
    const parentId = formData.get('parentId') || null
    
    if (!name) {
      return { success: false, error: 'Category name is required' }
    }
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const category = await categoryRepository.create({
      name,
      slug,
      description,
      parentId: parentId || null,
      isActive: true,
    })
    
    return { success: true, category }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function updateCategoryAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const categoryId = formData.get('categoryId')
    const name = formData.get('name')
    const description = formData.get('description')
    const parentId = formData.get('parentId') || null
    const isActive = formData.get('isActive') === 'on'
    
    // Generate slug from name if name changed
    const existingCategory = await categoryRepository.findById(categoryId)
    let slug = existingCategory.slug
    
    if (name && name !== existingCategory.name) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    await categoryRepository.update(categoryId, {
      name,
      slug,
      description,
      parentId: parentId || null,
      isActive,
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteCategoryAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const categoryId = formData.get('categoryId')
    await categoryRepository.delete(categoryId) // Soft delete
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminCategoriesPage() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../domain/models/Category')

  const [categories, topLevelCategories] = await Promise.all([
    categoryRepository.findAll({}),
    categoryRepository.findTopLevel(),
  ])

  const categoriesData = categories.map(c => JSON.parse(JSON.stringify(c)))
  const topLevelCategoriesData = topLevelCategories.map(c => JSON.parse(JSON.stringify(c)))

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categoriesData.map(async (category) => {
      const products = await productRepository.findByCategory(category._id)
      return {
        ...category,
        productCount: products.length,
      }
    })
  )

  // Build category tree
  const categoryTree = topLevelCategoriesData.map(parent => ({
    ...parent,
    children: categoriesWithCounts.filter(c => c.parentId?.toString() === parent._id.toString()),
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>Add New Category</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card>
            {categoriesWithCounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No categories found.</p>
                <Link href="/admin/categories/new">
                  <Button>Create First Category</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoriesWithCounts.map((category) => {
                      const parent = categoriesWithCounts.find(c => c._id.toString() === category.parentId?.toString())
                      return (
                        <tr key={category._id.toString()}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.slug}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {parent ? parent.name : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.productCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link href={`/admin/categories/${category._id}`} className="text-primary-600 hover:text-primary-900">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Add Form */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Quick Add Category</h2>
            <CategoryForm action={createCategoryAction} topLevelCategories={topLevelCategoriesData} />
          </Card>
        </div>
      </div>
    </div>
  )
}

