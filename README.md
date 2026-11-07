# HospitalityPro™ — Multi-Tenant Hotel & Restaurant Management Suite (Reseller Edition)

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://hospitality-pro.pages.dev)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**HospitalityPro** is an enterprise-grade, multi-tenant Hotel and Restaurant operating system engineered specifically for software resellers, hotel chains, and independent restaurateurs. One single installation empowers resellers to license and serve unlimited clients with instant plan provisioning and data isolation.

---

## 🌟 Key Features & Innovations

### 1. 💼 Multi-Tenant Reseller Control Center
- **Dynamic Plan Provisioning:** Instantly switch clients between packages:
  - `restaurant` (Only Restaurant): POS billing, live table layout, KOT kitchen screen, QR menu ordering, recipe inventory.
  - `hotel` (Only Hotel): Room rack, reservations, check-in/out, consolidated folio billing, inventory.
  - `both` (Full Hospitality Suite): All modules unlocked with cross-module **Charge-to-Room** and checkout billing locks.
- **Reseller Licensing:** Real-time client activation/suspension, validity date control, and monthly recurring revenue (MRR) tracking.
- **Zero Downtime Plan Switching:** Changes take effect immediately without database migration or code redeployments.

### 2. 🍽️ Touch-Optimized POS Billing Terminal
- **Dine-In & Takeaway Modes:** Fast table selector with live vacant/occupied indicator.
- **Smart Menu Catalog:** Instant search, category filters, and Veg/Non-Veg indicators.
- **Dynamic UPI Payment QR:** Generates real-time UPI QR codes with bill amount and merchant ID for GPay, PhonePe, and Paytm.
- **Cross-Module Room Billing:** Charge restaurant orders directly to in-house hotel guests with instant folio settlement.
- **Thermal & Tax Invoices:** Generates 58mm/80mm thermal receipts and GST-compliant tax invoices with CGST/SGST breakdowns.

### 3. 👨‍🍳 Real-Time Kitchen Display System (KDS / KOT)
- **Live Ticket Kanban:** 8-second auto-syncing order tickets with elapsed duration timers.
- **Item Lifecycle:** Status flow through `New` ➔ `Preparing` ➔ `Ready` ➔ `Served`.
- **QR Order Identification:** Distinct visual badge and audio chimes for mobile self-orders.

### 4. 📱 Contactless Customer QR Ordering
- **No App Download Required:** Dine-in guests scan table QR tents to explore the live digital menu.
- **Direct-to-Kitchen Transmission:** Orders stream immediately to the kitchen KDS with customer tracking.
- **Printable Table QR Tents:** Generator for professional printable table tent cards with unique tokens.

### 5. 🏨 Hotel Front Desk & Consolidated Folios
- **Visual Room Rack:** Color-coded status matrix: Available (Green), Occupied (Blue), Cleaning (Yellow), Maintenance (Red).
- **Fast Guest Registration:** Walk-in check-in with ID proof, advance deposit tracking, and double-booking collision prevention.
- **Consolidated Folio Engine:** `Nights × Rate + Room GST + Restaurant Charges − Advance = Net Payable`.
- **Checkout Protection Lock:** Blocks checkout if an in-house guest has unpaid restaurant orders.

### 6. 📦 Inventory & Smart Recipe Auto-Deductions
- **Live Raw Material Ledger:** Tracks ingredients in kg, L, g, and pcs with min-threshold alerts.
- **Automatic Recipe Deductions:** Bills automatically calculate ingredient proportions and deduct stock in real time.
- **Quick Restock Controls:** 1-click +5 / +10 unit stock additions and audit logs.

---

## 🚀 Quick Start & Development

```bash
# Clone the repository
git clone https://github.com/aklove4047-cpu/hospitality-pro.git
cd hospitality-pro

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 🌐 Deployment to Cloudflare Pages

HospitalityPro is optimized for Cloudflare's global edge network:

```bash
# Build the optimized production bundle
npm run build

# Deploy directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name hospitality-pro
```

---

## 👥 Personas & Roles

| Role | Access Scope |
|---|---|
| **Super Admin (Reseller)** | Create & manage tenant licenses, switch plans, view MRR |
| **Owner** | Full client access, staff management, GST & business profile |
| **Manager** | POS billing, room check-ins, menu pricing, inventory restock |
| **Cashier** | Live POS terminal, bill generation, discount & payment settlement |
| **Kitchen Master** | Live KOT display, ticket preparation status |
| **Front Desk Reception** | Room rack, guest check-in/out, folio printing |
| **Customer (Public)** | Scan-and-order mobile menu |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
