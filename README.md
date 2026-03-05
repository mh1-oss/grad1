# Tech-Shop E-Commerce Platform 🛒

Welcome to **Tech-Shop**, a premium and responsive e-commerce platform built as a final project. This application provides a full shopping experience including product browsing, category filtering, a persistent shopping cart, user authentication, an admin dashboard, and a mock checkout process.

## 🚀 Live Demo

*(Insert your Vercel URL here after deployment)* 

---

## ✨ Features

### 🛍️ Storefront
- **Premium UI/UX** with Vanilla CSS, CSS Variables, and smooth micro-animations.
- **Light/Dark Mode** toggle via React Context. 
- **Dynamic Hero Slider** — auto-playing slides managed from the Admin Dashboard.
- **Product Browsing** — category filter, search bar, and pagination.
- **Product Details** — image gallery and "Add to Cart" functionality.
- **Persistent Cart** — managed with `zustand` + LocalStorage.
- **Mock Checkout** — shipping & payment form with a success confirmation page.

### 🔐 Authentication
- Secure signup/login using `bcryptjs` for password hashing.
- JWT session cookies via `jose`.
- Protected routes (Profile page requires login).

### 🛡️ Admin Dashboard (`/admin`)
- **Role-Based Access Control** — only users with the `ADMIN` role can access `/admin/*`.
- **Product Management** — Add, Edit, and Delete products.
- **Hero Slider Management** — Add, Edit, and Delete homepage slides in real-time.
- Access via the **Profile Page** (Admin Dashboard button appears only for admins).

---

## 🔑 Test Accounts & Configuration

**Admin Account:**
*   **Email:** `admin@techshop.com`
*   **Password:** `admin123`

*(Note: Ensure your `.env` file contains the `JWT_SECRET` variable for authentication to work correctly. A fallback is used if missing, but it's required for production).*

### 💳 Demo Checkout Card

When using the checkout feature, you can use the following dummy card details:
*   **Card Number:** `4242 4242 4242 4242`
*   **Expiry Date:** `12/28`
*   **CVV:** `123`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) (App Router) | Fullstack Framework |
| TypeScript | Language |
| [Zustand](https://github.com/pmndrs/zustand) | Client State Management |
| [Neon](https://neon.tech/) (Serverless Postgres) | Database |
| [Prisma](https://www.prisma.io/) | ORM |
| [Lucide React](https://lucide.dev/) | Icons |
| Vanilla CSS | Styling (No Tailwind) |
| `bcryptjs` + `jose` | Auth (Hashing + JWT) |

---

## 📦 Getting Started

### Prerequisites

- Node.js v18+
- npm
- A [Neon](https://neon.tech/) Database connection string

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tech-shop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
    JWT_SECRET="your_super_secret_jwt_key"
    ```

4.  **Initialize the Database & Seed Data:**
    ```bash
    npx prisma db push
    npx tsx prisma/seed.ts
    npx tsx prisma/seed-admin.ts
    npx tsx prisma/seed-slides.ts
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
tech-shop/
├── prisma/
│   ├── schema.prisma        # Database schema (User, Product, Category, Slide)
│   ├── seed.ts               # Seed products & categories
│   ├── seed-admin.ts         # Seed admin user
│   └── seed-slides.ts        # Seed hero slides
├── src/
│   ├── app/
│   │   ├── admin/            # Admin Dashboard (Products + Slides CRUD)
│   │   ├── api/              # API Route Handlers (Auth, Products, Admin)
│   │   ├── cart/              # Shopping Cart page
│   │   ├── checkout/          # Checkout + Success pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── products/          # Products listing + detail pages
│   │   ├── profile/           # User Profile (with Admin access button)
│   │   ├── globals.css        # Global styles (Light/Dark themes)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Prisma client singleton
│   └── store/                 # Zustand cart store
└── .env                       # Environment variables
```

