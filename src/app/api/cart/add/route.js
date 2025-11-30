import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import connectDB from '../../../../lib/db/mongoose'
import cartService from '../../../../domain/services/CartService'
import productService from '../../../../domain/services/ProductService'
import { generateSessionId } from '../../../../lib/auth/session'

export async function POST(request) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    let sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      sessionId = generateSessionId()
      cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      })
    }

    const body = await request.json()
    const { productId, size, color, quantity } = body

    if (!productId || !size || !color || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get product to find the correct variant SKU
    const product = await productService.getProduct(productId)
    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    )

    if (!variant) {
      return NextResponse.json(
        { success: false, error: 'Variant not found for selected size and color' },
        { status: 400 }
      )
    }

    await cartService.addToCart(
      sessionId,
      productId,
      { size, color, sku: variant.sku },
      quantity
    )

    return NextResponse.json({ success: true, message: 'Item added to cart' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

