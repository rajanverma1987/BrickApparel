'use server'

import { cookies } from 'next/headers'
import connectDB from '../lib/db/mongoose'
import cartService from '../domain/services/CartService'
import { generateSessionId } from '../lib/auth/session'

export async function addToCartAction(formData) {
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

    const productId = formData.get('productId')
    const size = formData.get('size')
    const color = formData.get('color')
    const quantity = parseInt(formData.get('quantity') || '1')

    await cartService.addToCart(sessionId, productId, { size, color, sku: `${productId}-${size}-${color}` }, quantity)

    return { success: true, message: 'Item added to cart' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateCartItemAction(itemIndex, formData) {
  'use server'
  
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return { success: false, error: 'Session not found' }
    }

    const quantity = parseInt(formData.get('quantity') || '1')
    
    if (quantity < 1) {
      return { success: false, error: 'Quantity must be at least 1' }
    }

    await cartService.updateCartItem(sessionId, itemIndex, quantity)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function removeFromCartAction(itemIndex) {
  'use server'
  
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return { success: false, error: 'Session not found' }
    }

    await cartService.removeFromCart(sessionId, itemIndex)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getCartAction() {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return { success: true, cart: null }
    }

    const cart = await cartService.getCart(sessionId)
    const totals = cartService.calculateCartTotal(cart)

    return { success: true, cart, totals }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

