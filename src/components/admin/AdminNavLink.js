'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700 border border-primary-200'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
      }`}
    >
      {children}
    </Link>
  )
}

