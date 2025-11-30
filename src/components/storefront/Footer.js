import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="gradient-primary text-white mt-16" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/logo.webp"
              alt="Brick Apparel Logo"
              width={180}
              height={60}
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/90">
              Premium clothing for the modern lifestyle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Account</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Order History</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Brick Apparel. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-white/80">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-white/40">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

