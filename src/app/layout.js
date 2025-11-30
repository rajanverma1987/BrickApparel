import './globals.css'
import { Inter } from 'next/font/google'
import { ToastProvider } from '../components/ui/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brick Apparel - Premium Clothing Store',
  description: 'Shop the latest fashion trends at Brick Apparel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

