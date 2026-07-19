# EcoLoop AI ♻️

EcoLoop AI is a modern, full-stack e-waste management and reverse logistics platform. It connects households, businesses, collectors, and recyclers to make e-waste disposal simple, traceable, and rewarding.

## Features ✨

*   **Role-Based Dashboards:** Separate experiences for Individuals, Businesses, Collectors, Recyclers, and Admins.
*   **Smart Pickup Booking:** Multi-step wizard to categorize, weigh, and schedule pickups.
*   **AI Identification Mock:** Simulated AI module to identify waste categories and hazards from uploaded images.
*   **Real-time Tracking:** End-to-end timeline tracking using unique Pickup IDs.
*   **EcoPoint Rewards:** Users earn points for recycling, which can be redeemed for discounts.
*   **Environmental Impact Metrics:** Dashboards to visualize CO2 and toxic waste saved.

## Technology Stack 💻

*   **Framework:** Next.js 14+ (App Router)
*   **Styling:** Tailwind CSS + shadcn/ui
*   **Language:** TypeScript
*   **Database:** Prisma ORM (configured with SQLite via `@prisma/adapter-libsql` for rapid local dev)
*   **Authentication:** NextAuth.js (Credentials Provider + bcryptjs)

## Getting Started 🚀

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure you have a valid `NEXTAUTH_SECRET`. 

### 4. Database Setup (SQLite)
Run the following commands to push the Prisma schema and seed the database with demo accounts and data:
```bash
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts 🔑

Use these accounts to test the different role-based dashboards. **Password for all is:** `password123`

- Individual: `user@ecoloop.ai`
- Collector: `collector@ecoloop.ai`
- Recycler: `recycler@ecoloop.ai`
- Admin: `admin@ecoloop.ai`

## Demo Tracking ID 📦
Test the public tracking page (`/track`) with: **ECO-2026-000001**

## Project Structure 📁
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (shadcn) and domain components
- `/src/lib` - Utilities and Prisma singleton
- `/prisma` - Database schema and seed script

## Future Enhancements
- Integration with real Computer Vision APIs (e.g. Google Cloud Vision) for e-waste image classification.
- Route optimization logic for logistics partners.
- Actual QR Code generation and mobile scanning app integration.
