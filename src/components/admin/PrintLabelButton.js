'use client'

import Button from '../ui/Button'

function handlePrint(orderId) {
  // Open print label page in new window
  const printWindow = window.open(`/admin/orders/${orderId}/print-label`, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      // Wait a bit for content to load, then trigger print
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }
}

// Compact version for table rows
export default function PrintLabelButton({ orderId }) {
  return (
    <button
      type="button"
      onClick={() => handlePrint(orderId)}
      className="text-primary-600 hover:text-primary-900 text-sm font-medium inline-flex items-center"
      title="Print Shipping Label"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Label
    </button>
  )
}

// Full button version for detail page
export function PrintLabelButtonFull({ orderId }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => handlePrint(orderId)}
      className="w-full"
    >
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Label
    </Button>
  )
}

