# Fork.Fleet Food Delivery System

Full-stack food delivery application with:
- Customer web app (React + Vite)
- Admin panel (HTML/CSS/JS served by backend)
- Backend API (Express + MongoDB + Mongoose)

This README explains how the project works, how to run it, and where each major feature lives.

## 1. Tech Stack

### Frontend
- React 19
- Vite
- Framer Motion

### Backend
- Node.js
- Express 4
- MongoDB + Mongoose
- JWT auth
- bcryptjs
- Razorpay integration (with fallback flows)

### Admin Panel
- Static HTML/CSS/JS page served from backend at `/admin`

## 2. Project Structure

```text
food-delivery-system/
	admin/                  # Admin panel UI (index.html)
	backend/                # Express API + DB models + business logic
		server.js
	frontend/               # React customer app
		src/
	package.json            # Root scripts to run frontend + backend together
```

## 3. How The App Works

### Customer Side
- Browse menu and add items to cart
- Checkout with:
	- Online payment (Razorpay)
	- UPI direct/COD paths
	- QR fallback when online payment cannot start
- Track order statuses in "Where's My Order?"
- Print bills anytime from order tracking page (including delivered/cancelled)

### Admin Side
- Login to admin panel
- Manage menu items, reviews, customers, coupons
- Manage order statuses
- Accept QR payments from orders table using "Accept QR"
- View date-wise previous orders and revenue

### Backend Behavior
- Connects to local MongoDB (`mongodb://127.0.0.1:27017/forkfleet`) by default
- If local MongoDB is unavailable (and not production), it falls back to in-memory MongoDB
- Seeds default data automatically (admin user, menu items, reviews, coupons)

## 4. Default Admin Credentials

Seeded automatically on backend start:
- Email: `admin@forkfleet.com`
- Password: `admin123`

## 5. Installation

From project root:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## 6. Run The Project

### Option A: Run frontend + backend together (recommended)

From root:

```bash
npm start
```

This runs:
- Backend on port `5000`
- Frontend (Vite) on default dev port (usually `5173`)

### Option B: Run individually

From root:

```bash
npm run backend
```

and in another terminal:

```bash
npm run frontend
```

## 7. URLs

- Customer app: `http://localhost:5173` (or Vite port shown in terminal)
- API health: `http://localhost:5000/api/health`
- Admin panel: `http://localhost:5000/admin`

## 8. Environment Variables (Optional)

Backend supports these vars:

- `PORT` (default `5000`)
- `MONGO_URI` (default local Mongo URI)
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NODE_ENV`

Frontend optional API base:
- `VITE_API_BASE` or `VITE_API_URL`

If frontend env base is not set, runtime fallback points to:
- `http://<current-host>:5000/api`

## 9. Payment Flow Notes

### Online Payment
- Frontend calls `/api/payment/create-order`
- Verifies payment via `/api/payment/verify`

### QR Fallback
- If online payment cannot start, customer gets a demo QR popup
- Order is created with QR-related pending payment state
- Admin can click "Accept QR" in orders table
- Backend endpoint used by admin: `PATCH /api/admin/orders/:id/payment`

## 10. Order Status and Visibility

- Statuses include: `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`
- Cancelled orders store details: cancellation reason, timestamp, and canceller
- Customer tracking page shows cancelled/delivered state clearly
- Admin Orders page is currently configured to hide delivered/cancelled from active list

## 11. Important Backend Routes (High-Level)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/admin/login`
- `GET /api/admin/me`

### Menu
- `GET /api/menu`
- `GET /api/admin/menu`
- `POST /api/admin/menu`
- `PUT /api/admin/menu/:id`
- `DELETE /api/admin/menu/:id`
- `PATCH /api/admin/menu/:id/toggle`

### Orders
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:orderId`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `PATCH /api/admin/orders/:id/payment`

### Coupons
- `POST /api/coupons/validate`
- Admin coupon CRUD under `/api/admin/coupons`

### Reviews / Users / Stats
- Admin and public routes available in `backend/server.js`

## 12. Build / Lint

From `frontend`:

```bash
npm run lint
npm run build
npm run preview
```

## 13. Troubleshooting

### "Route not found" from frontend
- Ensure backend is running on port `5000`
- Verify frontend API base points to backend `/api`

### Payment "Unable to start payment"
- Razorpay keys may be missing or invalid
- Use QR fallback flow and admin "Accept QR"

### Admin "Accept QR" not working
- Ensure backend is restarted after latest code changes
- Confirm `PATCH /api/admin/orders/:id/payment` exists and backend is reachable

### Mongo connection issue
- Start local MongoDB service
- Or run in non-production mode and let in-memory fallback start

## 14. Notes For Development

- Backend currently keeps most API logic in a single `backend/server.js` file.
- Additional route/controller/model files exist but main running flow is from `server.js`.
- If you plan to scale, consider splitting `server.js` into modular routers/services.

