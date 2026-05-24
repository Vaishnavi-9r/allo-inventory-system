# Allo Inventory Reservation System

This project is a simplified inventory reservation system built for the Allo Engineering take-home assignment.

The goal was to prevent overselling during checkout by temporarily reserving stock before payment confirmation.

---

# Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Tailwind CSS

---

# Features

- Product listing with stock availability
- Multi-warehouse inventory management
- Temporary stock reservations
- Reservation expiry handling
- Confirm purchase flow
- Cancel reservation flow
- Live countdown timer
- Automatic stock updates
- 409 conflict handling for insufficient stock
- 410 handling for expired reservations

---

# Data Model

The system includes:

- Products
- Warehouses
- Inventory per warehouse
- Reservations

Inventory keeps track of:
- total stock
- reserved stock
- available stock

Reservations contain:
- status (PENDING / CONFIRMED / RELEASED)
- expiry time

---

# API Endpoints

## Products

GET `/api/products`

Returns all products with inventory information.

---

## Warehouses

GET `/api/warehouses`

Returns all warehouses.

---

## Reservations

POST `/api/reservations`

Creates a temporary reservation.

Returns:
- 409 if stock is unavailable

---

POST `/api/reservations/:id/confirm`

Confirms reservation after successful payment.

Returns:
- 410 if reservation expired

---

POST `/api/reservations/:id/release`

Releases reservation and restores stock.

---

# Concurrency Handling

The main challenge in this assignment was preventing overselling during concurrent reservation requests.

I used Prisma transactions to ensure reservation creation and stock updates happen together atomically.

For a larger production-scale system, I would additionally consider:
- row-level database locking
- Redis distributed locks
- idempotency keys

---

# Reservation Expiry

Reservations expire after 10 minutes.

Expired reservations are automatically released using:

`/api/cron/release-expired`

In production this endpoint can be triggered using:
- Vercel Cron Jobs
- background workers

---

# Local Setup

## 1. Clone Repository

```bash
git clone <repo-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Add Environment Variables

Create `.env`

```env
DATABASE_URL=your_supabase_database_url
```

---

## 4. Push Database Schema

```bash
npx prisma db push
```

---

## 5. Seed Database

```bash
npm run seed
```

---

## 6. Start Development Server

```bash
npm run dev
```

---

# Tradeoffs / Future Improvements

Due to time constraints, I focused mainly on correctness of the reservation lifecycle and inventory updates.

Some improvements I would make with more time:

- Better concurrency guarantees using row locks
- Redis-based distributed locking
- Idempotency support
- Authentication
- Better UI polish
- Real-time stock sync using WebSockets
- Automated testing

---

# Deployment

Frontend deployed on Vercel.

Database hosted on Supabase.

---

# Final Notes

This project helped me better understand inventory consistency problems and race conditions in ecommerce systems.

The most interesting part was designing reservation flows that safely update stock while handling expiry and concurrent requests.
