# GearUp Backend

GearUp Backend is a REST API for a sports and equipment rental platform. It supports customer registration, provider-managed gear listings, rental orders, provider order workflows, Stripe checkout payments, reviews, and admin management.

## Tech Stack

- Node.js with Express 5
- TypeScript
- Prisma 7 with PostgreSQL
- JWT authentication
- Cookie and Bearer token auth support
- Stripe Checkout and webhooks
- Zod-ready validation structure
- tsdown for production builds

## Core Features

- User registration and login for `CUSTOMER` and `PROVIDER` roles
- Admin-only user, rental, gear, and category management
- Provider gear creation, update, and deletion
- Public gear browsing with filtering, searching, sorting, and pagination
- Customer rental order creation and cancellation
- Provider rental status updates with controlled status transitions
- Stripe checkout session creation for confirmed rentals
- Stripe webhook handling for successful checkout completion
- Customer reviews after returned rentals
- Seed data for demo users, categories, gear items, rentals, payments, and reviews

## Requirements

- Node.js 24 or compatible with the project build target
- npm
- PostgreSQL database
- Stripe account for payment checkout and webhook testing

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root. Do not commit real secrets.

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_ACCESS_EXPIRES_IN="1d"
BCRYPT_SALT=10

STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

CLIENT_URL="http://localhost:3000"
```

## Database Setup

This project uses Prisma schema files from `prisma/schema` and stores migrations in `prisma/migrations`.

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run seed
```

The seed script creates demo users, categories, gear items, rentals, payments, and reviews. Seeded users share this password:

```text
Password123!
```

Example seeded accounts:

| Role | Email |
| --- | --- |
| Admin | `admin@gearup.test` |
| Provider | `ironhouse@gearup.test` |
| Provider | `pitchperfect@gearup.test` |
| Provider | `courtside@gearup.test` |
| Customer | `ayesha@gearup.test` |
| Customer | `tanvir@gearup.test` |
| Customer | `nabila@gearup.test` |

## Running the Project

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

Default base URL:

```text
http://localhost:5000
```

## Live Deployments

You can use either of these live API base URLs:

- Vercel: https://gearup-backend-gold.vercel.app
- Render: https://gearup-backend-soqv.onrender.com

Health/root endpoint:

```http
GET /
```

Response:

```json
{
  "message": "Welcome to gear up backend"
}
```

## Authentication

Protected routes use JWT authentication. After login, the API returns an `accessToken` and also sets an `accessToken` cookie.

You can authenticate either with the cookie or with an Authorization header:

```http
Authorization: Bearer <accessToken>
```

Supported roles:

- `ADMIN`
- `CUSTOMER`
- `PROVIDER`

User accounts can have one of these statuses:

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

Login body:

```json
{
  "email": "ayesha@example.com",
  "password": "Password123!"
}
```

`ADMIN` users cannot be created through public registration.

### User

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/user/me` | Admin, Customer, Provider | Get current user profile |
| `PATCH` | `/api/user/update-profile` | Admin, Customer, Provider | Update current user profile |
| `DELETE` | `/api/user/delete-profile` | Admin, Customer, Provider | Delete current user profile |

Update profile body example:

```json
{
  "name": "Updated Name",
  "phone": "+8801711111111",
  "address": "Banani, Dhaka"
}
```

### Category

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/category` | Admin | Create category |
| `GET` | `/api/category` | Public | Get all categories |
| `DELETE` | `/api/category/:categoryId` | Admin | Delete category |

Create category body:

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

The public `GET /api/gear` endpoint supports these query parameters:

| Query | Description | Default / Values |
| --- | --- | --- |
| `searchTerm` | Case-insensitive search across gear `title`, `brand`, and `description` | Optional |
| `minPrice` | Minimum `pricePerDay` filter | Optional number |
| `maxPrice` | Maximum `pricePerDay` filter | Optional number |
| `availability` | Filter by gear availability | `AVAILABLE`, `OUT_OF_STOCK`, `MAINTENANCE` |
| `brand` | Exact brand filter | Optional |
| `title` | Exact title filter | Optional |
| `categoryName` | Exact category name filter | Optional |
| `page` | Page number for pagination | Optional, starts at `1` |
| `limit` | Number of items per page | Defaults to `5` |
| `sortBy` | Field name to sort by | Defaults to `createdAt` |
| `sortOrder` | Sort direction | `asc` or `desc`, defaults to `asc` |

Example:

```http
GET /api/gear?searchTerm=football&minPrice=100&maxPrice=1000&page=1&limit=10&sortBy=pricePerDay&sortOrder=asc
```

### Customer Rentals

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/rental/customer` | Customer, Admin | Create rental order |
| `GET` | `/api/rental/customer` | Customer, Admin | View own rental orders |
| `PATCH` | `/api/rental/customer/cancel/:orderId` | Customer | Cancel own placed order |

Create rental body:

```json
{
  "gearId": "gear-uuid",
  "quantity": 2,
  "startDate": "2026-07-15",
  "endDate": "2026-07-17"
}
```

Rental creation rules:

- Gear must exist.
- Gear availability must be `AVAILABLE`.
- Requested quantity cannot exceed stock.
- Start date cannot be in the past.
- End date must be same day or after start date.
- New orders start with `PLACED` status.

### Provider Rentals

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/rental/provider` | Admin, Provider | View rental orders for provider gear |
| `PATCH` | `/api/rental/provider/:orderId` | Admin, Provider | Update rental order status |

Update rental status body:

```json
{
  "status": "CONFIRMED"
}
```

Rental status values:

- `PLACED`
- `CONFIRMED`
- `PAID`
- `PICKED_UP`
- `RETURNED`
- `LATE_RETURN`
- `CANCELLED`

Allowed status transitions:

| Current | Next |
| --- | --- |
| `PLACED` | `CONFIRMED`, `CANCELLED` |
| `CONFIRMED` | `PAID` |
| `PAID` | `PICKED_UP` |
| `PICKED_UP` | `RETURNED`, `LATE_RETURN` |
| `RETURNED` | None |
| `LATE_RETURN` | None |
| `CANCELLED` | None |

Providers cannot manually set `PAID`; successful Stripe payment updates the order to `PAID`.

### Payment

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/payment/create-session` | Customer, Admin | Create Stripe checkout session |
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
- Rental order must belong to the authenticated customer.
- Rental order status must be `CONFIRMED`.
- A successfully paid order cannot be paid again.
- Stripe amount is charged in `bdt`.

Payment status values:

- `PENDING`
- `SUCCESS`
- `FAILED`
- `REFUNDED`

### Reviews

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/review/create` | Customer, Admin | Create review |
| `GET` | `/api/review/:gearId` | Public | Get reviews for a gear item |

Create review body:

```json
{
  "gearId": "gear-uuid",
  "rentalOrderId": "rental-order-uuid",
  "rating": 5,
  "comment": "Clean equipment and smooth pickup."
}
```

Review rules:

- Customer must own the rental order.
- Rental order must be `RETURNED`.
- Review gear must match the rented gear.
- Rating must be from 1 to 5.
- Each rental order can have one review.

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

Admin gear and rental list endpoints support:

| Query | Description |
| --- | --- |
| `page` | Page number |
| `limit` | Items per page |

## Response Shape

Most successful responses use this shape:

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

Prisma errors are mapped for common cases such as duplicate keys, foreign key failures, missing records, and database connection/authentication issues.

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
|-- package.json
|-- prisma.config.ts
|-- tsconfig.json
`-- tsdown.config.ts
```

## Postman Collection
Here is the APIDocs : https://documenter.getpostman.com/view/29611624/2sBY4LQMgk#gear-up-api

The repository aslo includes a Postman collection:

```text
Gear-up.postman_collection.json
```

Import it into Postman to test the API endpoints quickly. Set the base URL to your running server, for example:

```text
http://localhost:5000
```

## Notes for Stripe Webhooks

The webhook endpoint is mounted before JSON parsing so Stripe can verify the raw request body:

```http
POST /api/payment/webhook
```

For local webhook testing, forward Stripe events to your local server and set `STRIPE_WEBHOOK_SECRET` from the Stripe CLI output.
