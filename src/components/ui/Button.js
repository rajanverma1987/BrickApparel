export default function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
  const baseStyles = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    // Primary: Red for urgency on key CTAs (Add to Cart, Buy Now, etc.)
    primary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100',
    // Secondary: Navy base for trust and stability
    secondary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all',
    // Outline: Navy border for secondary actions
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 transition-all',
    // Danger: Red for destructive actions
    danger: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg transition-all',
    // Trust: Deep blue for checkout and trust-building actions
    trust: 'bg-trust-600 text-white hover:bg-trust-700 focus:ring-trust-500 shadow-lg hover:shadow-xl transition-all',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

