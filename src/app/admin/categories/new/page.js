import connectDB from '../../../../lib/db/mongoose'
import categoryRepository from '../../../../domain/repositories/CategoryRepository'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import { getAdminSession } from '../../../../lib/auth/admin-auth'

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
    
    redirect(`/admin/categories/${category._id}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminNewCategoryPage() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Category')

  const topLevelCategories = await categoryRepository.findTopLevel()
  const topLevelCategoriesData = topLevelCategories.map(c => JSON.parse(JSON.stringify(c)))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/categories" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">Add New Category</h1>
        </div>
      </div>

      <Card>
        <form action={createCategoryAction} className="space-y-6">
          <Input
            label="Category Name"
            name="name"
            required
            placeholder="e.g., T-Shirts"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category (optional)
            </label>
            <select
              name="parentId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">None (Top Level)</option>
              {topLevelCategoriesData.map(cat => (
                <option key={cat._id.toString()} value={cat._id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select a parent category to create a subcategory
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Create Category</Button>
            <Link href="/admin/categories">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

