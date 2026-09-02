<div align="center">

# Maison Saint-Germain
### *Archive & Quiet Luxury*

**A premium vintage fashion e-commerce storefront curating authenticated European archival pieces — outerwear, tailoring, knitwear, leather goods, and heritage accessories.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Paystack](https://img.shields.io/badge/Paystack-Live-00C3F7?style=flat-square)](https://paystack.com)
[![Resend](https://img.shields.io/badge/Resend-Email-black?style=flat-square)](https://resend.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

</div>

---

## Overview

Maison Saint-Germain is a full-stack vintage clothing archive built with **Next.js 15**, offering a luxurious browsing and purchasing experience for rare, authenticated European vintage pieces. Each item ships with a physical **Deed of Provenance** and an archival certificate number.

The storefront features a fully integrated payment and post-purchase email pipeline:

- 🛒 **Add to cart** → 📋 **Checkout with delivery details** → 💳 **Pay via Paystack** → ✅ **Server-side verification** → 📧 **Branded email confirmation**

---

## Features

| Feature | Detail |
|---|---|
| **Product Archive** | 8 curated vintage pieces across 5 categories |
| **Multi-currency** | KES (primary), USD, NGN — switchable in header |
| **Paystack v2 Inline** | Card, Mobile Money (M-Pesa), Apple Pay, Bank Transfer |
| **Server Verification** | `/api/verify` calls Paystack API to confirm `status: success` before fulfilling |
| **Anti-tampering** | Amount + currency cross-checked server-side |
| **Order Confirmation Email** | Branded luxury email via Resend + React Email |
| **Provenance Deed** | Unique certificate number per order (`CERT-SG-YYYY-XXXXXX`) |
| **Cart Persistence** | Cart state persisted to `localStorage` via `useSyncExternalStore` |
| **Responsive Design** | Mobile-first, works across all screen sizes |

---

## Tech Stack

- **Framework** — [Next.js 15](https://nextjs.org) (App Router, Server Components)
- **Language** — TypeScript 5.9
- **Styling** — Tailwind CSS 4 + custom design tokens
- **Payments** — [Paystack](https://paystack.com) v2 Inline Popup
- **Email** — [Resend](https://resend.com) + [React Email](https://react.email) components
- **Icons** — [Lucide React](https://lucide.dev)
- **Fonts** — Cormorant Garamond (serif) + Plus Jakarta Sans (sans) via Google Fonts

---

## Project Structure

```
maison-saint-germain/
├── app/
│   ├── api/verify/         # POST — Paystack server-side verification + email trigger
│   ├── layout.tsx          # Root layout (fonts, Paystack script, CartProvider)
│   └── page.tsx            # Homepage
├── components/
│   ├── CheckoutModal.tsx   # Checkout form + Paystack v2 popup launch
│   ├── CartDrawer.tsx      # Slide-over cart
│   ├── OrderSuccessModal.tsx # Post-payment provenance deed display
│   ├── ProductCard.tsx     # Archive item card
│   ├── ProductDetailModal.tsx # Quick-view with measurements & provenance
│   ├── Catalog.tsx         # Category-filtered product grid
│   ├── Header.tsx          # Sticky nav with currency switcher
│   ├── Hero.tsx            # Landing hero section
│   ├── BrandStory.tsx      # Heritage & provenance charter
│   └── Footer.tsx
├── context/
│   └── CartContext.tsx     # Global cart + currency state (KES/USD/NGN)
├── data/
│   └── products.ts         # 8 archival product records with KES/USD/NGN pricing
├── emails/
│   └── OrderConfirmation.tsx # React Email luxury email template
├── lib/
│   ├── email.ts            # Resend send helper (non-blocking, error-safe)
│   └── utils.ts
├── types/
│   └── index.ts            # Product, CartItem, CustomerDetails, OrderVerificationResponse
├── .env.example            # Required environment variables (template)
└── next.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A **[Paystack](https://dashboard.paystack.com)** account with live/test keys
- A **[Resend](https://resend.com)** account and API key

### 1. Clone & install

```bash
git clone https://github.com/Muhia88/Maison-Saint-Germain.git
cd Maison-Saint-Germain
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your real keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# App base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Paystack — https://dashboard.paystack.com/#/settings/developers
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..."
PAYSTACK_SECRET_KEY="sk_live_..."

# Resend — https://resend.com/api-keys
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="orders@yourdomain.com"
```

> **Testing locally?** Use Paystack test keys (`pk_test_` / `sk_test_`) and set `RESEND_FROM_EMAIL="onboarding@resend.dev"` (no domain verification needed).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Payment Flow

```
Customer fills checkout form
        │
        ▼
Paystack v2 Popup opens
(Card / M-Pesa / Apple Pay / Bank Transfer)
        │
        ▼
Customer completes payment on Paystack
        │
        ▼
onSuccess(reference) callback fires
        │
        ▼
POST /api/verify
  ├─ Calls https://api.paystack.co/transaction/verify/:ref
  ├─ Checks status === "success"
  ├─ Validates amount & currency
  └─ Generates orderId + certificateNumber
        │
        ├─▶ Returns OrderVerificationResponse to client
        │     └─ Cart cleared, OrderSuccessModal shown
        │
        └─▶ sendOrderConfirmationEmail() [non-blocking]
              └─ Branded email sent via Resend
```

---

## Email Confirmation

After every successful payment, the customer receives a beautifully crafted transactional email containing:

- ✦ Maison Saint-Germain branded header & gold accent rules
- 🟢 Payment verified badge (shows channel: Card / M-Pesa / Apple Pay / Bank Transfer)
- 📋 Itemised provenance manifest (all purchased pieces)
- 💰 Total settlement in customer's currency (KES / USD / NGN)
- 🚚 Full delivery address & courier details
- 🌲 What's in the parcel — cedar garment bag, physical provenance deed, authenticity card
- 📜 Archival certificate number for lifetime reference

---

## Deployment

### Vercel (recommended)

```bash
npm run build   # verify it builds cleanly first
vercel deploy
```

Set the following environment variables in your Vercel project dashboard:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack live public key |
| `PAYSTACK_SECRET_KEY` | Paystack live secret key (server-only) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `NEXT_PUBLIC_APP_URL` | Your production URL |

---

## Accepted Payment Methods

As configured in the Paystack dashboard:

| Method | Coverage |
|---|---|
| 💳 Credit / Debit Card | Visa, Mastercard, Verve |
| 📱 Mobile Money | M-Pesa (Kenya), MTN, Airtel |
| 🍎 Apple Pay | Safari on iPhone / Mac |
| 🏦 Bank Transfer | Direct bank transfer |

**Default currency:** KES · International payments enabled.

---

## License

MIT © 2026 Maison Saint-Germain
