import jwt from 'jsonwebtoken'
import adminUserRepository from '../../domain/repositories/AdminUserRepository'
import customerRepository from '../../domain/repositories/CustomerRepository'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'

export function createToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getAdminUser(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded || !decoded.adminId) return null

    const admin = await adminUserRepository.findById(decoded.adminId)
    if (!admin || !admin.isActive) return null

    return admin
  } catch (error) {
    return null
  }
}

export async function getCustomer(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded || !decoded.customerId) return null

    const customer = await customerRepository.findById(decoded.customerId)
    if (!customer || !customer.isActive) return null

    return customer
  } catch (error) {
    return null
  }
}

export function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

