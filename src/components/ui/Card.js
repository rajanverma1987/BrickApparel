export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-primary-100 hover:shadow-xl transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

