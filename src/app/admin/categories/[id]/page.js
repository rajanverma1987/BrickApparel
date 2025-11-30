import connectDB from '../../../../lib/db/mongoose'
import categoryRepository from '../../../../domain/repositories/CategoryRepository'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import { getAdminSession } from '../../../../lib/auth/admin-auth'
import DeleteForm from '../../../../components/admin/DeleteForm'

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
    
    redirect('/admin/categories')
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
    
    redirect('/admin/categories')
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminCategoryEditPage({ params }) {
  // Redirect if trying to access "new" as an ID
  if (params.id === 'new') {
    redirect('/admin/categories/new')
  }

  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Category')

  const [category, allCategories] = await Promise.all([
    categoryRepository.findById(params.id),
    categoryRepository.findAll({}),
  ])

  if (!category) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
        <Link href="/admin/categories">
          <Button>Back to Categories</Button>
        </Link>
      </div>
    )
  }

  const categoryData = JSON.parse(JSON.stringify(category))
  const allCategoriesData = allCategories.map(c => JSON.parse(JSON.stringify(c)))
  
  // Filter out current category and its children from parent options
  const parentOptions = allCategoriesData.filter(
    c => c._id.toString() !== categoryData._id.toString()
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/categories" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form action={updateCategoryAction} className="space-y-6">
              <input type="hidden" name="categoryId" value={categoryData._id.toString()} />
              
              <Input
                label="Category Name"
                name="name"
                defaultValue={categoryData.name}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={categoryData.description || ''}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category (optional)
                </label>
                <select
                  name="parentId"
                  defaultValue={categoryData.parentId?.toString() || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">None (Top Level)</option>
                  {parentOptions.map(cat => (
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
                    defaultChecked={categoryData.isActive}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save Changes</Button>
                <Link href="/admin/categories">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Category Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Slug:</span>
                <p className="text-gray-900">{categoryData.slug}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <p className="text-gray-900">
                  {new Date(categoryData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Updated:</span>
                <p className="text-gray-900">
                  {new Date(categoryData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="mt-6 border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Deleting a category will mark it as inactive. Products in this category will remain but the category won't be visible.
            </p>
            <DeleteForm
              action={deleteCategoryAction}
              confirmMessage={`Are you sure you want to delete the category "${categoryData.name}"? This will mark it as inactive and cannot be undone.`}
              variant="danger"
              className="w-full"
              hiddenFields={{
                categoryId: categoryData._id.toString()
              }}
              successMessage={`Category "${categoryData.name}" deleted successfully`}
              errorMessage="Failed to delete category"
            >
              Delete Category
            </DeleteForm>
          </Card>
        </div>
      </div>
    </div>
  )
}

