import OpenAI from 'openai'
import AWS from 'aws-sdk'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

class AIImageService {
  async generateImage(prompt, style = 'photographic', variations = 1) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const enhancedPrompt = this.buildPrompt(prompt, style)
    const images = []

    for (let i = 0; i < variations; i++) {
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        })

        const imageUrl = response.data[0].url
        
        // Upload to cloud storage
        const cloudUrl = await this.uploadToCloudStorage(imageUrl, `ai-generated-${Date.now()}-${i}.png`)
        
        images.push({
          url: cloudUrl,
          prompt: enhancedPrompt,
          style,
          generatedAt: new Date(),
        })
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error)
        throw new Error(`Failed to generate image: ${error.message}`)
      }
    }

    return images
  }

  async uploadToCloudStorage(imageUrl, filename) {
    try {
      // Download image from OpenAI
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(imageBuffer)

      // Upload to S3
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `products/ai-generated/${filename}`,
        Body: buffer,
        ContentType: 'image/png',
        ACL: 'public-read',
      }

      const uploadResult = await s3.upload(uploadParams).promise()
      return uploadResult.Location
    } catch (error) {
      console.error('Error uploading to cloud storage:', error)
      // Fallback to original URL if cloud upload fails
      return imageUrl
    }
  }

  buildPrompt(prompt, style) {
    const stylePrompts = {
      photographic: 'professional product photography, studio lighting, clean background',
      lifestyle: 'lifestyle photography, natural setting, authentic environment',
      artistic: 'artistic style, creative composition, unique perspective',
      minimalist: 'minimalist style, simple composition, clean design',
    }

    const styleDescription = stylePrompts[style] || stylePrompts.photographic

    return `High-quality product image of ${prompt}. Style: ${styleDescription}. Professional e-commerce product photography, high resolution, detailed, commercial quality.`
  }

  async deleteImage(imageUrl) {
    try {
      // Extract key from S3 URL
      const url = new URL(imageUrl)
      const key = url.pathname.substring(1) // Remove leading slash

      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      }).promise()

      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new AIImageService()

