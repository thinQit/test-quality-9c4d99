# restaurant management platform with online ordering, reservations, and menu management

A restaurant management platform that supports online ordering, table reservations, menu management, and a staff/admin dashboard with role-based access.

## Features
- Online ordering with cart, modifiers, and checkout
- Reservation management with availability workflows
- Menu and category CRUD with availability controls
- Staff dashboard for live orders and reservations
- Role-based access control and JWT authentication
- Analytics endpoints for sales dashboards
- API-first architecture for web and mobile clients

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM with SQLite (dev)
- Tailwind CSS
- Jest + React Testing Library
- Playwright (E2E)

## Prerequisites
- Node.js 18+
- npm

## Quick Start
```bash
./install.sh
# or
./install.ps1
```
Then run:
```bash
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` and update as needed:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## Project Structure
```
src/app/            # App Router pages and layout
src/app/api/        # API routes
src/components/     # UI components and layout
src/lib/            # Utilities and server helpers
src/providers/      # Client providers
prisma/             # Prisma schema
```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST /api/restaurants`
- `GET/PUT/DELETE /api/restaurants/:id`
- `GET/POST /api/restaurants/:id/categories`
- `PUT/DELETE /api/categories/:categoryId`
- `GET/POST /api/restaurants/:id/menu-items`
- `PUT/DELETE /api/menu-items/:itemId`
- `POST/GET /api/restaurants/:id/orders`
- `GET/PUT /api/orders/:orderId`
- `POST/GET /api/restaurants/:id/reservations`
- `PUT/DELETE /api/reservations/:reservationId`
- `GET /api/users/:userId/orders`
- `GET /api/dashboard/sales`
- `POST /api/payments/webhook`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Prisma generate + Next build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest
- `npm run test:e2e` - Run Playwright tests

## Testing
- Unit & component tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Notes
- SQLite is used for local development. Consider migrating to Postgres for production.
- JWT secrets should be rotated and stored securely in production.
