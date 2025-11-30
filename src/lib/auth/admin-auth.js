import { cookies } from 'next/headers'
import { getAdminUser } from './session'
import connectDB from '../db/mongoose'

export async function getAdminSession() {
  await connectDB()
  
  const cookieStore = await cookies()
  const token = cookieStore.get('adminToken')?.value

  if (!token) {
    return null
  }

  const admin = await getAdminUser(token)
  return admin
}

export async function requireAdmin() {
  const admin = await getAdminSession()
  
  if (!admin) {
    throw new Error('Unauthorized')
  }

  return admin
}

export async function checkAdminPermission(admin, resource, action) {
  if (admin.role === 'admin') {
    return true
  }

  const permissions = admin.permissions?.[resource]
  if (!permissions) {
    return false
  }

  return permissions[action] === true
}

