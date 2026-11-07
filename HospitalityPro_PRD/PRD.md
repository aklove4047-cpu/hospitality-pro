# HospitalityPro — Product Requirements Document (PRD)

**Version:** 1.0  
**Product:** Multi-tenant Hotel + Restaurant Management Software (Reseller Edition)  
**Stack:** Node.js + Express, SQLite, Vanilla JS (glassmorphism UI)  
**Status:** Ready for build / deployment

---

## 1. Overview

HospitalityPro is a single, ready-made software that a reseller can sell to many different businesses. Every client (tenant) gets its own isolated data and logins, and the reseller decides which modules each client receives:

| Plan | Description |
|---|---|
| `restaurant` | Only Restaurant |
| `hotel` | Only Hotel |
| `both` | Hotel + Restaurant |

One codebase, one installation, any number of clients. Changing a client's plan switches modules on or off instantly, with no code change.

## 2. Goals

- Give the reseller one product to sell to hotels, restaurants and hotel-with-restaurant businesses.
- Cover daily operations: POS billing, table management, kitchen orders (KOT), inventory, QR ordering, room bookings.
- Keep hosting cost low (free, self-hostable stack).
- Give the reseller control: plan, validity date and active/inactive per client.

## 3. Users & Roles

| Role | Permissions |
|---|---|
| Super Admin (Reseller) | Create clients, set plan, validity, activate/deactivate |
| Owner | Everything in the client account, staff management, GST and business settings |
| Manager | Menu, tables, rooms, inventory, billing, bookings |
| Cashier | POS, KOT, billing, bills |
| Kitchen | Kitchen screen only |
| Reception | Rooms, bookings, check-in/out, bills |

## 4. Module Matrix

| Module | Only Restaurant | Only Hotel | Hotel + Restaurant |
|---|:-:|:-:|:-:|
| POS billing, table management, KOT/kitchen, QR menu ordering | Yes | No | Yes |
| Rooms, bookings, check-in/out, folio | No | Yes | Yes |
| Room service / charge-to-room | No | No | Yes |
| Inventory (with recipe auto-deduct), bills, staff, dashboard | Yes | Yes | Yes |

## 5. Functional Requirements

### FR-1 Multi-tenant & Reseller Panel
- Reseller creates a client with business name, plan, GST details, validity date and an owner login.
- Reseller can change a client's plan, validity date and active status at any time.
- Inactive or expired clients cannot log in and QR ordering stops working.
- All data is isolated per client (`tenant_id` on every record).

### FR-2 POS & Billing
- Select a table or start a takeaway order; tap menu items to add them.
- Multiple KOTs can be sent for the same table before billing.
- Cancel individual items; apply discount; GST auto-calculated (client-configurable).
- Payment mode: cash, UPI, card. Printable receipt with business name, address, GSTIN.

### FR-3 Table Management
- Add or delete tables; live free/occupied status.
- Each table has a unique, unguessable QR code that can be printed.

### FR-4 Kitchen (KOT)
- Live kitchen screen (auto-refresh every 8 seconds).
- Item status flow: new → preparing → ready → served.
- QR-originated orders are marked so the kitchen can identify them.

### FR-5 QR Ordering (Customer)
- Customer scans the table QR, sees the menu by category, adds items and places an order without logging in.
- Order goes straight to the kitchen; customer can see item status.
- Rate-limited to prevent abuse.

### FR-6 Inventory
- Items with unit, current stock, minimum stock, cost.
- Low-stock alerts on the dashboard.
- Stock in/out adjustments.
- Recipes: link menu items to ingredients; stock is deducted automatically when a bill is generated.

### FR-7 Hotel Management
- Rooms with number, type, nightly rate and status (available / occupied / cleaning / maintenance).
- Bookings with guest name, phone, ID proof, dates, adults and advance payment.
- Double-booking protection for the same room and overlapping dates.
- Check-in, check-out and cancellation.
- Folio: nights × rate + room GST + restaurant charges − advance = payable.

### FR-8 Charge-to-Room (Hotel + Restaurant plan)
- Food orders can be linked to an in-house guest and charged to the room.
- Checkout settles room charges and restaurant charges together.
- Checkout is blocked while the guest still has unbilled restaurant orders.

### FR-9 Dashboard & Reports
- Today's sales, bills count, open orders.
- Hotel: occupancy, arrivals today, departures today.
- Low-stock list.

### FR-10 Staff & Settings (Owner)
- Create and delete staff with a role.
- Set phone, address, GSTIN, food GST % and room GST %.

## 6. Non-Functional Requirements

- **Security:** JWT authentication, bcrypt password hashing, tenant isolation on every query, login and QR-order rate limiting, escaped output in the UI.
- **Performance:** SQLite in WAL mode; suitable for a single-location business per client and a modest number of clients on one server.
- **Usability:** Responsive layout for desktop, tablet and mobile; touch-friendly POS.
- **Cost:** Free open-source stack; self-hostable on a small VPS.

## 7. Data Model

`tenants`, `users`, `dining_tables`, `categories`, `menu_items`, `orders`, `order_items`, `bills`, `inventory`, `recipes`, `rooms`, `bookings`

The database file and all tables are created automatically on first start. A default Super Admin account is also created automatically on first start.

## 8. Key API Groups

| Group | Purpose |
|---|---|
| `/api/login`, `/api/me` | Authentication |
| `/api/admin/tenants` | Reseller: manage clients |
| `/api/users`, `/api/settings` | Owner: staff and business settings |
| `/api/menu`, `/api/categories`, `/api/tables` | Restaurant setup, QR generation |
| `/api/orders`, `/api/kitchen` | POS orders, KOT, kitchen status |
| `/api/orders/:id/bill`, `/api/bills` | Billing |
| `/api/rooms`, `/api/bookings` | Hotel setup, bookings, check-in/out, folio |
| `/api/inventory` | Stock and recipes |
| `/api/reports/summary` | Dashboard |
| `/api/public/*` | Customer QR menu, order and status (no login) |

## 9. Deployment Requirements

### Environment variables

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Long random secret for login tokens (required) |
| `ADMIN_USER` / `ADMIN_PASS` | Initial Super Admin credentials (set a strong password) |
| `PUBLIC_URL` | Public site URL, used inside QR codes |
| `TZ` | Time zone, e.g. `Asia/Kolkata` (affects "today" in reports) |
| `DB_FILE` | Path of the SQLite file (point to a persistent disk in production) |
| `PORT` | Provided automatically by most hosts |

### Data persistence (important)
The SQLite database is a single file. The host must keep that file between restarts and redeploys. Hosts with an ephemeral filesystem (including free tiers of most platforms) erase it, which would delete all clients, menus, bookings and bills. Production hosting must provide either a persistent disk or a VPS, plus regular backups of the database file.

### Recommended hosting options
1. Small VPS with PM2 + Nginx + free SSL (best value for a reseller business).
2. Render paid web service with a persistent disk mounted (for example at `/var/data`) and `DB_FILE=/var/data/data.db`.
3. Free tier only for demos and testing, never for live client data.

## 10. Acceptance Criteria

- A restaurant-only client cannot access hotel features and a hotel-only client cannot access restaurant features (API returns 403, menu hides modules).
- Changing a client's plan takes effect on their next page load.
- The same room cannot be booked twice for overlapping dates.
- Generating a bill deducts inventory according to the recipes.
- Checkout is blocked while restaurant orders linked to the guest are unbilled.
- QR code for a table opens the customer menu, and the order appears on the kitchen screen within the refresh interval.
- Expired or inactive clients are blocked from logging in.

## 11. Out of Scope for v1.0 / Roadmap

- Thermal printer (ESC/POS) support
- Custom domain / branding per client
- GST report export (Excel/PDF)
- Online payment gateway
- Split bills and merged tables
- Multi-branch per client
- QR order approval by staff before it reaches the kitchen
- Late-checkout / actual-nights billing
- Automated database backups and PostgreSQL option for scale

## 12. Reseller Sales Pitch (Summary)

One software, three packages: Only Restaurant, Only Hotel, Hotel + Restaurant. POS billing, table management, kitchen orders, inventory and QR ordering are included. Each client gets a private account with their own staff logins, and the reseller controls plans and subscription validity from a single panel.
