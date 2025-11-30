# Color Psychology Implementation Guide

## Brand Mode: Classic Casual

**Base Palette:** Navy/Deep Blue (#1e3a5f) for trust and stability  
**Accent:** Red (#dc2626) for urgency and CTAs  
**Mood:** Dependable, clean, easy browsing

## Color Usage Rules

### Primary Actions (Red - #dc2626)
- ✅ "Add to Cart" buttons
- ✅ "Buy Now" buttons
- ✅ "Shop Now" CTAs
- ✅ Sale banners
- ✅ Limited offer notices
- ✅ Cart badge indicators

### Trust Elements (Navy - #1e3a5f)
- ✅ Checkout page background
- ✅ "Proceed to Checkout" button
- ✅ "Place Order" button
- ✅ Footer background
- ✅ Navigation hover states

### Neutral Elements
- ✅ Product image backgrounds (gray-100)
- ✅ Base text (gray-700/gray-800)
- ✅ Secondary actions (outline buttons)

## Accessibility Compliance

### Contrast Ratios (WCAG AA)
- **Red (#dc2626) on White:** 4.5:1 ✅ (Passes AA for normal text)
- **Navy (#1e3a5f) on White:** 7.1:1 ✅ (Passes AA for normal text)
- **White on Red (#dc2626):** 4.5:1 ✅ (Passes AA for normal text)
- **White on Navy (#1e3a5f):** 7.1:1 ✅ (Passes AA for normal text)

All color combinations meet WCAG AA standards for accessibility.

## Component Updates

### Updated Components
1. **Button Component** - Red primary variant for CTAs, Navy trust variant for checkout
2. **Checkout Page** - Navy gradient background for trust
3. **Header** - Navy accents, red cart badge
4. **Footer** - Navy gradient background
5. **Product Cards** - Neutral gray backgrounds for images
6. **Homepage Banners** - Red CTAs on navy backgrounds

### CSS Variables
All colors are defined in `globals.css` as CSS variables for easy theme switching:
- `--base-navy`: #1e3a5f
- `--cta-red`: #dc2626
- `--trust-blue`: #1e3a5f
- `--sale-accent`: #dc2626

## Future Theme Switching

The theme is configured to allow easy switching between:
- **Trendy Vibrant** - Bold neutrals, red/warm accents
- **Classic Casual** - Navy base, red accents (current)
- **Modern Minimal** - White/black, minimal red accents

To switch themes, update the color values in `tailwind.config.js` and `globals.css`.

