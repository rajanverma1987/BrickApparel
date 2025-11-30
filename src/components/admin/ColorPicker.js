'use client'

import { useState, useEffect } from 'react'

export default function ColorPicker({ name, defaultValue, id }) {
  const [colorHex, setColorHex] = useState(defaultValue || '#CCCCCC')

  useEffect(() => {
    setColorHex(defaultValue || '#CCCCCC')
  }, [defaultValue])

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        id={id}
        name={name}
        value={colorHex}
        onChange={(e) => {
          setColorHex(e.target.value)
          const textInput = e.target.nextElementSibling
          if (textInput) textInput.value = e.target.value
        }}
        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
        required
      />
      <input
        type="text"
        value={colorHex}
        onChange={(e) => {
          const newValue = e.target.value
          if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
            setColorHex(newValue)
            const colorInput = e.target.previousElementSibling
            if (colorInput) colorInput.value = newValue
          } else {
            setColorHex(newValue)
          }
        }}
        pattern="^#[0-9A-Fa-f]{6}$"
        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        placeholder="#CCCCCC"
      />
    </div>
  )
}

