# GearUp Multi-Provider Rental Testing Guide

Default password for all seeded users:

```text
Password123!
```

## Seeded Accounts

```text
Admin:    admin@gearup.test
Provider: ironhouse@gearup.test
Provider: pitchperfect@gearup.test
Provider: courtside@gearup.test
Customer: ayesha@gearup.test
Customer: tanvir@gearup.test
Customer: nabila@gearup.test
```

## Setup

Run these after pulling the changes:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

Use this base URL locally:

```text
http://localhost:5000
```

For protected routes, use:

```http
Authorization: Bearer <accessToken>
```

## Full Multi-Provider Flow

### 1. Login Customer

```http
POST /api/auth/login
```

```json
{
  "email": "ayesha@gearup.test",
  "password": "Password123!"
}
```

Save `data.accessToken`.

### 2. Get Gear IDs

```http
GET /api/gear?limit=20
```

Pick gear from at least two providers. Example seeded titles:

```text
Bowflex SelectTech 552 Adjustable Dumbbells
Adidas UEFA Match Football
Yonex Astrox Badminton Racket Set
```

Save the gear `id` values.

### 3. Create One Rental Order With Multiple Providers

```http
POST /api/rental/customer
```

```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-03",
  "items": [
    {
      "gearId": "<ironhouse-gear-id>",
      "quantity": 1
    },
    {
      "gearId": "<pitchperfect-gear-id>",
      "quantity": 2
    },
    {
      "gearId": "<courtside-gear-id>",
      "quantity": 1
    }
  ]
}
```

Save:

```text
rentalOrder.id
rentalOrder.items[].id
rentalOrder.items[].providerId
```

### 4. Login Each Provider

```http
POST /api/auth/login
```

```json
{
  "email": "ironhouse@gearup.test",
  "password": "Password123!"
}
```

Repeat for:

```text
pitchperfect@gearup.test
courtside@gearup.test
```

### 5. Provider Views Own Items

```http
GET /api/rental/provider
```

Each provider should only see rental order items where they are the provider.

### 6. Each Provider Confirms Their Own Item

```http
PATCH /api/rental/provider/items/<rentalOrderItemId>
```

```json
{
  "status": "CONFIRMED"
}
```

Expected behavior:

```text
First provider confirmation: order becomes PARTIALLY_CONFIRMED
After all items are confirmed: order becomes CONFIRMED
Gear stock decreases per confirmed item
```

### 7. Customer Creates Stripe Checkout Session

Only works after all order items are confirmed.

```http
POST /api/payment/create-session
```

```json
{
  "rentalOrderId": "<rental-order-id>"
}
```

Expected:

```text
Returns Stripe checkout URL
Creates or reuses a pending payment
Payment amount equals all item subtotals
```

### 8. Stripe Webhook Marks Payment Successful

For local Stripe CLI testing:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Then complete the checkout session in Stripe.

Expected:

```text
Payment status becomes SUCCESS
Rental order status becomes PAID
All confirmed order items become PAID
```

### 9. Providers Mark Items Picked Up

```http
PATCH /api/rental/provider/items/<rentalOrderItemId>
```

```json
{
  "status": "PICKED_UP"
}
```

Expected:

```text
Some items picked up: order becomes PARTIALLY_PICKED_UP
All items picked up: order becomes PICKED_UP
```

### 10. Providers Mark Items Returned

```http
PATCH /api/rental/provider/items/<rentalOrderItemId>
```

```json
{
  "status": "RETURNED"
}
```

Expected:

```text
Some items returned: order becomes PARTIALLY_RETURNED
All items returned: order becomes RETURNED
Gear stock increases per returned item
```

### 11. Customer Reviews Each Returned Item

```http
POST /api/review/create
```

```json
{
  "rentalOrderItemId": "<returned-rental-order-item-id>",
  "rating": 5,
  "comment": "Great quality gear and smooth pickup."
}
```

Expected:

```text
One review is allowed per rental order item
Review is blocked before item status is RETURNED or LATE_RETURN
```

## Admin Checks

```http
GET /api/admin/rentals
GET /api/admin/gear
GET /api/payment
```

Admin should see complete orders with nested `items`, each item's `gear`, `provider`, optional `review`, and order-level `payment`.

## Important Changed Request Bodies

Create rental order:

```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-03",
  "items": [
    {
      "gearId": "<gear-id>",
      "quantity": 1
    }
  ]
}
```

Create review:

```json
{
  "rentalOrderItemId": "<rental-order-item-id>",
  "rating": 5,
  "comment": "Great gear."
}
```

Provider status update:

```http
PATCH /api/rental/provider/items/<rentalOrderItemId>
```

```json
{
  "status": "CONFIRMED"
}
```
