import { redirect } from 'next/navigation'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { cookies } from 'next/headers'
import connectDB from '../../../lib/db/mongoose'
import adminUserRepository from '../../../domain/repositories/AdminUserRepository'
import { createToken } from '../../../lib/auth/session'
import LoginForm from '../../../components/admin/LoginForm'

async function loginAction(formData) {
  'use server'
  
  try {
    await connectDB()

    const email = formData.get('email')
    const password = formData.get('password')
    const rememberMe = formData.get('rememberMe') === 'on'

    const admin = await adminUserRepository.findByEmail(email)
    if (!admin || !admin.isActive) {
      return { success: false, error: 'Invalid credentials' }
    }

    const isValid = await admin.comparePassword(password)
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    const token = createToken({ adminId: admin._id.toString() })
    const cookieStore = await cookies()
    
    // Set cookie expiration based on "Remember Me" checkbox
    // If checked: 30 days, otherwise: 7 days (session-like)
    const maxAge = rememberMe 
      ? 30 * 24 * 60 * 60  // 30 days
      : 7 * 24 * 60 * 60   // 7 days
    
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
    })

    // Store email in cookie if "Remember Me" is checked
    if (rememberMe) {
      cookieStore.set('adminRememberedEmail', email, {
        httpOnly: false, // Needs to be accessible by client-side JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
      cookieStore.set('adminRememberMe', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      })
    } else {
      // Clear remember me cookies if unchecked
      cookieStore.delete('adminRememberedEmail')
      cookieStore.delete('adminRememberMe')
    }

    // Return success instead of redirecting to avoid redirect error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default async function AdminLoginPage() {
  const admin = await getAdminSession()

  if (admin) {
    redirect('/admin')
  }

  // Get remembered email from cookie
  const cookieStore = await cookies()
  const rememberedEmail = cookieStore.get('adminRememberedEmail')?.value || ''
  const rememberMeChecked = cookieStore.get('adminRememberMe')?.value === 'true'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm action={loginAction} rememberedEmail={rememberedEmail} rememberMeChecked={rememberMeChecked} />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Secure admin access
        </p>
      </div>
    </div>
  )
}

