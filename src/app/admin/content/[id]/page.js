import connectDB from '../../../../lib/db/mongoose'
import contentBlockRepository from '../../../../domain/repositories/ContentBlockRepository'
import { getAdminSession } from '../../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import DeleteForm from '../../../../components/admin/DeleteForm'

async function updateContentBlockAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const blockId = formData.get('blockId')
    const type = formData.get('type')
    const title = formData.get('title')
    const order = parseInt(formData.get('order') || '0')
    const isActive = formData.get('isActive') === 'on'
    
    // Handle content based on type
    let content = {}
    if (type === 'banner') {
      content = {
        title: formData.get('contentTitle') || '',
        description: formData.get('contentDescription') || '',
        ctaText: formData.get('ctaText') || 'Shop Now',
        ctaLink: formData.get('ctaLink') || '/products',
      }
    } else {
      content = {
        text: formData.get('contentText') || '',
      }
    }
    
    await contentBlockRepository.update(blockId, {
      type,
      title,
      content,
      order,
      isActive,
    })
    
    redirect(`/admin/content?toast=1&type=success&message=${encodeURIComponent('Content block updated successfully')}`)
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteContentBlockAction(formData) {
  'use server'
  
  try {
    await connectDB()
    
    const blockId = formData.get('blockId')
    await contentBlockRepository.delete(blockId)
    
    redirect('/admin/content')
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminContentEditPage({ params }) {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/ContentBlock')

  let block
  try {
    block = await contentBlockRepository.findById(params.id)
    if (!block) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">Content Block Not Found</h1>
          <p className="text-gray-600 mb-4">The content block you're looking for doesn't exist.</p>
          <Link href="/admin/content">
            <Button>Back to Content Blocks</Button>
          </Link>
        </div>
      )
    }
    block = JSON.parse(JSON.stringify(block))
  } catch (error) {
    redirect(`/admin/content?toast=1&type=error&message=${encodeURIComponent(error.message || 'Content block not found')}`)
  }

  const isBanner = block.type === 'banner'
  const content = block.content || {}

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/content" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Content Blocks
          </Link>
          <h1 className="text-3xl font-bold">Edit Content Block</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form action={updateContentBlockAction} className="space-y-6">
              <input type="hidden" name="blockId" value={block._id.toString()} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={block.type}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="banner">Banner</option>
                  <option value="section">Section</option>
                  <option value="text">Text</option>
                  <option value="featured_products">Featured Products</option>
                </select>
              </div>

              <div>
                <Input
                  label="Title"
                  name="title"
                  defaultValue={block.title || ''}
                />
              </div>

              {isBanner && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      name="contentTitle"
                      defaultValue={content.title || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Description
                    </label>
                    <textarea
                      name="contentDescription"
                      defaultValue={content.description || ''}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <Input
                      label="CTA Text"
                      name="ctaText"
                      defaultValue={content.ctaText || 'Shop Now'}
                    />
                  </div>
                  <div>
                    <Input
                      label="CTA Link"
                      name="ctaLink"
                      defaultValue={content.ctaLink || '/products'}
                    />
                  </div>
                </>
              )}

              {!isBanner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    name="contentText"
                    defaultValue={content.text || content.description || ''}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div>
                <Input
                  label="Order"
                  name="order"
                  type="number"
                  defaultValue={block.order || 0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={block.isActive}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save Changes</Button>
                <Link href="/admin/content">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Block Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Type:</span>
                <p className="text-gray-900 capitalize">{block.type}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <p className="text-gray-900">
                  {new Date(block.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Updated:</span>
                <p className="text-gray-900">
                  {new Date(block.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="mt-6 border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Deleting a content block will mark it as inactive. This action cannot be undone.
            </p>
            <DeleteForm
              action={deleteContentBlockAction}
              confirmMessage={`Are you sure you want to delete the content block "${block.title || block._id}"? This action cannot be undone.`}
              variant="danger"
              className="w-full"
              hiddenFields={{
                blockId: block._id.toString()
              }}
              successMessage={`Content block "${block.title || block._id}" deleted successfully`}
              errorMessage="Failed to delete content block"
            >
              Delete Content Block
            </DeleteForm>
          </Card>
        </div>
      </div>
    </div>
  )
}

