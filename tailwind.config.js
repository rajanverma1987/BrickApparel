/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Mode: Classic Casual
        // Base: Navy/Deep Blue for trust and stability
        primary: {
          50: '#e8f0f7',
          100: '#d1e1ef',
          200: '#a3c3df',
          300: '#75a5cf',
          400: '#4787bf',
          500: '#1e3a5f', // Main navy base
          600: '#1a3251',
          700: '#162943',
          800: '#122035',
          900: '#0e1727',
        },
        // Accent: Red for urgency and CTAs
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Primary red for CTAs
          600: '#dc2626', // Hover state
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Secondary: Neutral grays for balance
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Trust: Deep blue for checkout and trust elements
        trust: {
          50: '#e8f0f7',
          100: '#d1e1ef',
          200: '#a3c3df',
          300: '#75a5cf',
          400: '#4787bf',
          500: '#1e3a5f', // Deep navy
          600: '#1a3251',
          700: '#162943',
          800: '#122035',
          900: '#0e1727',
        },
      },
    },
  },
  plugins: [],
}

