'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InventoryTable({ products }) {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  // Flatten products into variants with product info
  const allVariants = products.flatMap((product) =>
    product.variants?.map((variant) => ({
      product,
      variant,
      stock: variant.inventory?.quantity || 0,
      threshold: variant.inventory?.lowStockThreshold || 10,
      isLowStock: (variant.inventory?.quantity || 0) <= (variant.inventory?.lowStockThreshold || 10),
      isOutOfStock: (variant.inventory?.quantity || 0) === 0,
    })) || []
  )

  // Filter variants based on filter state
  const filteredVariants = showLowStockOnly
    ? allVariants.filter((item) => item.isLowStock)
    : allVariants

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Show Low Stock Only
            </span>
          </label>
          <span className="text-sm text-gray-500">
            Showing {filteredVariants.length} of {allVariants.length} variants
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVariants.length > 0 ? (
              filteredVariants.map((item, idx) => (
                <tr
                  key={`${item.product._id}-${idx}`}
                  className={
                    item.isOutOfStock
                      ? 'bg-red-50'
                      : item.isLowStock
                      ? 'bg-yellow-50'
                      : ''
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/admin/products/${item.product._id}`}
                      className="hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.variant.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.variant.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {item.variant.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.threshold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.isOutOfStock
                          ? 'bg-red-100 text-red-800'
                          : item.isLowStock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.isOutOfStock
                        ? 'Out of Stock'
                        : item.isLowStock
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  {showLowStockOnly
                    ? 'No low stock items found'
                    : 'No variants found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

