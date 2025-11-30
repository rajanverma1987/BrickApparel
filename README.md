# Brick Apparel - E-commerce Platform

A full-featured clothing e-commerce platform built with Next.js, MongoDB, and modern web technologies.

## Features

- **Storefront**
  - Product browsing and search
  - Shopping cart
  - Guest checkout
  - Order tracking

- **Admin Panel**
  - Product management with AI image generation
  - Order management
  - Inventory tracking
  - Content management
  - Real-time notifications

- **Payments**
  - Stripe integration
  - PayPal integration
  - Webhook handling
  - Refund support

- **Additional Features**
  - Analytics
  - Email notifications
  - Low stock alerts
  - Guest order history

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Payments**: Stripe, PayPal
- **AI**: OpenAI (for image generation)
- **Email**: Nodemailer
- **Storage**: AWS S3

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Stripe account
- PayPal account (for PayPal integration)
- AWS account (for image storage)
- OpenAI API key (for AI image generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brickapparel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- MongoDB connection string
- Stripe keys
- PayPal credentials
- AWS credentials
- OpenAI API key
- SMTP settings

4. Seed the database:
```bash
npm run seed
```

This creates:
- Sample products and categories
- Admin user (admin@brickapparel.com / admin123)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (storefront)/      # Public storefront routes
│   ├── admin/             # Admin panel (protected)
│   └── api/               # API routes (webhooks)
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── storefront/       # Storefront components
├── domain/               # Business logic layer
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # Data access layer
│   └── services/        # Business logic services
├── lib/                  # Utilities and configs
│   ├── db/              # Database connection
│   ├── auth/             # Authentication
│   └── payments/        # Payment integrations
└── actions/              # Server actions
```

## Architecture

The project follows clean architecture principles:

- **UI Layer**: Next.js pages and components (no business logic)
- **Service Layer**: Domain services containing all business rules
- **Repository Layer**: Data access abstraction
- **Models**: Mongoose schemas for data structure

## Admin Panel

Access the admin panel at `/admin`

Default credentials (after seeding):
- Email: admin@brickapparel.com
- Password: admin123

**Important**: Change the default password in production!

## Payment Testing

### Stripe
Use Stripe test mode with test card numbers:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

### PayPal
Use PayPal sandbox accounts for testing.

## Webhooks

Configure webhooks in your payment provider dashboards:

- **Stripe**: `https://yourdomain.com/api/webhooks/stripe`
- **PayPal**: `https://yourdomain.com/api/webhooks/paypal`

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

## License

MIT

