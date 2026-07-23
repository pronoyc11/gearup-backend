# GearUp Backend

GearUp Backend is a REST API for a sports and equipment rental marketplace. Customers can browse gear, create multi-item rental orders, pay through Stripe Checkout, and review returned items. Providers manage gear and fulfill their own rental order items, while admins can manage users, gear, categories, rentals, and payments.

## Project Links

- Backend Repository: https://github.com/pronoyc11/gearup-backend/tree/main
- Live API: https://gearup-backend-gold.vercel.app
- API Docs: https://documenter.getpostman.com/view/29611624/2sBY4LQMgk#gear-up-api
- Demo Video: https://youtu.be/atEantVfHDg
- Postman Collection: `Gear-up.postman_collection.json`

## Tech Stack

- Node.js, Express 5, and TypeScript
- Prisma 7 with PostgreSQL
- JWT auth with bearer-token and cookie support
- Stripe Checkout and Stripe webhooks
- bcrypt password hashing
- tsdown production build
- Vercel deployment config

## Core Features

- Public registration/login for `CUSTOMER` and `PROVIDER` users
- Admin-only user activation/suspension
- Category create, update, delete, and public listing
- Provider gear create/update/delete with public browsing
- Gear search, price filtering, category filtering, sorting, and pagination
- Multi-item rental orders with items from one or more providers
- Provider-level rental item status updates
- Automatic parent order status sync from item statuses
- Stripe checkout for fully confirmed rental orders
- Stripe webhook payment confirmation
- Review creation, update, and deletion for returned rental items
- Seed data for users, categories, gear, rentals, payments, and reviews

## Requirements

- Node.js 24 or compatible with the configured build target
- npm
- PostgreSQL
- Stripe account for checkout and webhook testing

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_ACCESS_EXPIRES_IN="1d"
BCRYPT_SALT=10

STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

CLIENT_URL="http://localhost:3000"
```

## Database Setup

Prisma is configured in `prisma.config.ts` to read schema files from `prisma/schema` and migrations from `prisma/migrations`.

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

Seeded users share this password:

```text
Password123!
```

Seeded accounts:

| Role | Email |
| --- | --- |
| Admin | `admin@gearup.test` |
| Provider | `ironhouse@gearup.test` |
| Provider | `pitchperfect@gearup.test` |
| Provider | `courtside@gearup.test` |
| Customer | `ayesha@gearup.test` |
| Customer | `tanvir@gearup.test` |
| Customer | `nabila@gearup.test` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with `tsx watch` |
| `npm run build` | Build `src/server.ts` into `dist` with tsdown |
| `npm start` | Run the compiled server from `dist/server.mjs` |
| `npm run seed` | Seed the database |

Default local API URL:

```text
http://localhost:5000
```

Health/root endpoint:

```http
GET /
```

```json
{
  "message": "Welcome to gear up backend"
}
```

## Authentication

After login, the API returns an `accessToken` and sets an `accessToken` cookie.

```http
Authorization: Bearer <accessToken>
```

Supported roles:

- `ADMIN`
- `CUSTOMER`
- `PROVIDER`

User statuses:

- `ACTIVE`
- `SUSPENDED`

Suspended users cannot log in.

## API Overview

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a customer or provider |
| `POST` | `/api/auth/login` | Public | Login and receive an access token |

Register body:

```json
{
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "password": "Password123!",
  "role": "CUSTOMER",
  "phone": "+8801700000000",
  "address": "Dhaka, Bangladesh"
}
```

`ADMIN` users cannot be created through public registration.

### User

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/user/me` | Admin, Customer, Provider | Get current profile |
| `PATCH` | `/api/user/update-profile` | Admin, Customer, Provider | Update current profile |
| `DELETE` | `/api/user/delete-profile` | Admin, Customer, Provider | Delete current profile |

### Category

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/category` | Admin | Create category |
| `GET` | `/api/category` | Public | Get all categories |
| `PATCH` | `/api/category/:categoryId` | Admin | Update category |
| `DELETE` | `/api/category/:categoryId` | Admin | Delete category |

Create/update category body:

```json
{
  "name": "Football",
  "description": "Footballs, goals, cones, bibs, and training kits."
}
```

### Gear

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/gear` | Provider | Create gear item |
| `GET` | `/api/gear` | Public | Get gear list |
| `GET` | `/api/gear/:gearId` | Public | Get single gear item |
| `PATCH` | `/api/gear/:gearId` | Provider, Admin | Update gear item |
| `DELETE` | `/api/gear/:gearId` | Provider, Admin | Delete gear item |

Create gear body:

```json
{
  "categoryId": "category-uuid",
  "title": "Adidas UEFA Match Football",
  "description": "Size 5 match football suitable for games and training.",
  "brand": "Adidas",
  "pricePerDay": 150,
  "stock": 30,
  "specifications": {
    "size": 5,
    "material": "PU leather",
    "certification": "FIFA Quality Pro"
  },
  "availability": "AVAILABLE",
  "image": "https://example.com/football.jpg"
}
```

Gear availability values:

- `AVAILABLE`
- `OUT_OF_STOCK`
- `MAINTENANCE`

`GET /api/gear` query parameters:

| Query | Description |
| --- | --- |
| `searchTerm` | Case-insensitive search across title, brand, and description |
| `minPrice` | Minimum `pricePerDay` |
| `maxPrice` | Maximum `pricePerDay` |
| `availability` | `AVAILABLE`, `OUT_OF_STOCK`, or `MAINTENANCE` |
| `brand` | Exact brand match |
| `title` | Exact title match |
| `categoryName` | Exact category name match |
| `page` | Page number |
| `limit` | Items per page, defaults to `5` |
| `sortBy` | Sort field, defaults to `createdAt` |
| `sortOrder` | `asc` or `desc`, defaults to `asc` |

Example:

```http
GET /api/gear?searchTerm=football&minPrice=100&maxPrice=1000&page=1&limit=10&sortBy=pricePerDay&sortOrder=asc
```

### Customer Rentals

Rental orders now contain an `items` array. Each item stores its own `gearId`, `providerId`, quantity, subtotal, and status.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/rental/customer` | Customer, Admin | Create rental order |
| `GET` | `/api/rental/customer` | Customer, Admin | View own rental orders |
| `GET` | `/api/rental/customer/:orderId` | Customer, Admin | View own rental order details |
| `PATCH` | `/api/rental/customer/cancel/:orderId` | Customer | Cancel own placed order |

Create rental body:

```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-03",
  "items": [
    {
      "gearId": "gear-uuid-1",
      "quantity": 1
    },
    {
      "gearId": "gear-uuid-2",
      "quantity": 2
    }
  ]
}
```

Rental creation rules:

- At least one item is required.
- Duplicate gear items are not allowed in the same order.
- Every item must include `gearId` and a quantity of at least `1`.
- Gear must exist and be `AVAILABLE`.
- Requested quantity cannot exceed stock.
- Dates must use `YYYY-MM-DD`.
- Start date cannot be in the past.
- End date must be same day or after start date.
- New orders and items start with `PLACED` status.

### Provider Rentals

Providers operate on rental order items, not the whole parent order. Admins can see and update all provider items.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/rental/provider` | Admin, Provider | View provider rental items |
| `GET` | `/api/rental/provider/:orderId` | Admin, Provider | View order details scoped to provider items |
| `PATCH` | `/api/rental/provider/items/:itemId` | Admin, Provider | Update rental order item status |

Update rental item body:

```json
{
  "status": "CONFIRMED"
}
```

Provider item status transitions:

| Current | Next |
| --- | --- |
| `PLACED` | `CONFIRMED` |
| `CONFIRMED` | `PAID` |
| `PAID` | `PICKED_UP` |
| `PICKED_UP` | `RETURNED`, `LATE_RETURN` |
| `RETURNED` | None |
| `LATE_RETURN` | None |
| `CANCELLED` | None |

Providers cannot manually set `PAID`; Stripe webhook completion moves confirmed items to `PAID`.

Parent rental order status is derived from item statuses:

- Some confirmed items: `PARTIALLY_CONFIRMED`
- All confirmed items: `CONFIRMED`
- Successful payment: `PAID`
- Some picked up items: `PARTIALLY_PICKED_UP`
- All picked up items: `PICKED_UP`
- Some returned or late items: `PARTIALLY_RETURNED`
- All returned or late items: `RETURNED`

Stock decreases when an item is confirmed and increases when it is returned or marked late.

### Payment

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/payment/create-session` | Customer, Admin | Create Stripe Checkout session |
| `POST` | `/api/payment/webhook` | Stripe | Handle Stripe webhook events |
| `GET` | `/api/payment` | Admin, Customer | View payments |
| `GET` | `/api/payment/:paymentId` | Customer, Admin | View payment details |

Create checkout session body:

```json
{
  "rentalOrderId": "rental-order-uuid"
}
```

Payment rules:

- Rental order must exist.
- Rental order must belong to the authenticated customer unless requester is admin.
- Parent order status must be `CONFIRMED`, meaning all provider items are confirmed.
- Successfully paid orders cannot be paid again.
- Stripe amount is charged in `bdt`.
- A pending payment is stored with provider `STRIPE`.
- `checkout.session.completed` marks the payment `SUCCESS`, sets `paidAt`, and moves the order/items to `PAID`.

Payment statuses:

- `PENDING`
- `SUCCESS`
- `FAILED`
- `REFUNDED`

Payment provider enum values:

- `STRIPE`
- `SSLCOMMERZ`

Only Stripe checkout is currently wired in the route/service layer.

### Reviews

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/review/create` | Customer, Admin | Create review |
| `GET` | `/api/review/:gearId` | Public | Get reviews for a gear item |
| `PATCH` | `/api/review/:reviewId` | Customer, Admin | Update own review |
| `DELETE` | `/api/review/:reviewId` | Customer, Admin | Delete own review |

Create review body:

```json
{
  "rentalOrderItemId": "rental-order-item-uuid",
  "rating": 5,
  "comment": "Clean equipment and smooth pickup."
}
```

Review rules:

- Customer must own the rental order that contains the item.
- Rental order item must be `RETURNED` or `LATE_RETURN`.
- Rating must be from `1` to `5`.
- Each rental order item can have one review.

### Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `PATCH` | `/api/admin/users/:userId` | Admin | Activate or suspend user |
| `GET` | `/api/admin/users` | Admin | Fetch all users |
| `GET` | `/api/admin/users/:userId` | Admin | Fetch single user |
| `GET` | `/api/admin/gear` | Admin | Fetch all gear |
| `GET` | `/api/admin/rentals` | Admin | Fetch all rentals |

Update user status body:

```json
{
  "status": "SUSPENDED"
}
```

Admin gear and rental list endpoints support `page` and `limit` query parameters.

## Multi-Provider Rental Flow

1. Customer creates one rental order with multiple `items`.
2. Each provider sees only the order items that belong to them.
3. Providers confirm their own items with `PATCH /api/rental/provider/items/:itemId`.
4. When all items are confirmed, the parent order becomes `CONFIRMED`.
5. Customer creates a Stripe checkout session for the order.
6. Stripe webhook marks the payment `SUCCESS` and updates confirmed items to `PAID`.
7. Providers move their items through `PICKED_UP` and then `RETURNED` or `LATE_RETURN`.
8. Customer can review each returned rental order item.

For a step-by-step manual testing guide, see `MULTI_PROVIDER_TESTING.md`.

## Response Shape

Successful responses generally use:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation message",
  "data": {}
}
```

Errors are returned by the global error handler:

```json
{
  "success": false,
  "statusCode": 500,
  "name": "Error",
  "message": "Error message",
  "error": "Stack trace"
}
```

## Stripe Webhooks

The webhook route is mounted before JSON parsing so Stripe can verify the raw request body:

```http
POST /api/payment/webhook
```

For local testing:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Project Structure

```text
.
|-- prisma
|   |-- migrations
|   |-- schema
|   |   |-- schema.prisma
|   |   |-- enum.prisma
|   |   |-- user.schema.prisma
|   |   |-- category.schema.prisma
|   |   |-- gear.schema.prisma
|   |   |-- rentalOrder.schema.prisma
|   |   |-- payment.schema.prisma
|   |   `-- review.schema.prisma
|   `-- seed.ts
|-- src
|   |-- app.ts
|   |-- server.ts
|   `-- app
|       |-- config
|       |-- errors
|       |-- lib
|       |-- middlewares
|       |-- modules
|       |   |-- admin
|       |   |-- auth
|       |   |-- category
|       |   |-- gear
|       |   |-- payment
|       |   |-- rentals
|       |   |-- reviews
|       |   `-- user
|       `-- utils
|-- Gear-up.postman_collection.json
|-- MULTI_PROVIDER_TESTING.md
|-- package.json
|-- prisma.config.ts
|-- tsconfig.json
|-- tsdown.config.ts
`-- vercel.json
```

## Deployment

Build the project before deploying:

```bash
npm run build
```

Vercel is configured to serve `dist/server.mjs` through `vercel.json`.
