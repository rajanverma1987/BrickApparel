import { NextResponse } from 'next/server'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import AWS from 'aws-sdk'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const s3 = process.env.AWS_ACCESS_KEY_ID ? new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
}) : null

export async function POST(request) {
  try {
    // Check admin authentication
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Handle both File and Blob types
    if (!(file instanceof File) && !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Get file properties
    const fileType = file.type || 'application/octet-stream'
    const fileName = file.name || 'image'
    const fileSize = file.size || 0

    // Validate file type
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = fileName.split('.').pop() || 'jpg'
    const filename = `variant-${timestamp}-${randomStr}.${extension}`

    let imageUrl

    // Upload to S3 if configured, otherwise use local storage
    if (s3 && process.env.AWS_S3_BUCKET) {
      try {
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `products/variants/${filename}`,
          Body: buffer,
          ContentType: fileType,
          ACL: 'public-read',
        }

        const uploadResult = await s3.upload(uploadParams).promise()
        imageUrl = uploadResult.Location
      } catch (s3Error) {
        console.error('S3 upload failed, falling back to local storage:', s3Error)
        // Fall through to local storage
      }
    }

    // Fallback to local storage if S3 not configured or upload failed
    if (!imageUrl) {
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'variants')
      
      // Create directory if it doesn't exist
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, buffer)

      // Return public URL
      imageUrl = `/uploads/variants/${filename}`
    }

    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename: filename 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}

