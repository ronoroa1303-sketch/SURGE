# SURGE D2C E-Commerce Backend

This is the complete backend system for SURGE Protein Snacks. Built with Node.js, Express, MongoDB, and secured with JWT. It supports full product catalogs, shopping carts, order management, Razorpay payment processing, and an admin dashboard logic.

## 🛠 Prerequisites

- Node.js installed (v16+)
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for Test/Live keys)
- Postman (for testing APIs)

## 🚀 Step-by-Step Setup Instructions

1. **Install Dependencies**
   Navigate to the `surge-backend` folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Make a copy of `.env.example` to `.env` (or just edit the existing `.env.example` and rename it to `.env`).
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/surge
   JWT_SECRET=add_your_secret_string_here
   RAZORPAY_KEY_ID=rzp_test_YourRazorPayTestKey
   RAZORPAY_KEY_SECRET=YourRazorPaySecret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

## 🧪 API Testing Guide (Postman)

Here are the critical API endpoints you can test. Remember to pass the `Authorization` header as `Bearer <token>` for protected routes!

### 1. Authentication (`/api/auth`)
- **Signup Request:** `POST /api/auth/signup`
  - Body (JSON): `{"name": "John Doe", "email": "john@test.com", "password": "123"}`
- **Login Request:** `POST /api/auth/login`
  - Body (JSON): `{"email": "john@test.com", "password": "123"}`
  - *Copy the returned `token` for the next steps.*

### 2. Products (`/api/products`)
- **GET All Products:** `GET /api/products` (Public)
- **POST Create Product:** `POST /api/products` (Admin Only)
  - Body (JSON): `{"name": "SURGE Vanilla", "price": 20, "protein": 15, "description": "High quality", "stock": 100}`

### 3. Cart (`/api/cart`)
- **GET Cart:** `GET /api/cart`
- **POST Add to Cart:** `POST /api/cart`
  - Body (JSON): `{"productId": "mongodb_ID_of_product", "qty": 2}`

### 4. Orders & Payments (`/api/order`, `/api/payment`)
- **POST Create Order:** `POST /api/order`
  - Body (JSON): `{"orderItems": [{"product": "product_ID", "name": "SURGE Vanilla", "qty": 2, "price": 20}], "shippingAddress": {"address":"123 St", "city":"Delhi", "postalCode":"110001", "country":"India"}, "itemsPrice": 40, "taxPrice": 0, "shippingPrice": 5, "totalPrice": 45}`
- **POST Create Razorpay Payment Intent:** `POST /api/payment/create-order`
  - Body (JSON): `{"orderId": "order_mongodb_ID"}`
  - *Returns Razorpay order_id used on frontend SDK*
- **POST Verify Webhook Signature:** `POST /api/payment/verify`
  - Body (JSON): `{"orderId": "...", "razorpayOrderId": "...", "razorpayPaymentId": "...", "razorpaySignature": "..."}`

---

## ☁️ Deployment Instructions (Replit / Railway)

### Deploying on Railway.app (Recommended)
1. Push the monorepo to GitHub.
2. Go to **Railway.app** -> **New Project** -> **Deploy from GitHub Repo**.
3. Select the repository and create a service for the backend.
4. In the backend service **Settings**, set **Root Directory** to:
   ```text
   /surge-backend
   ```
5. Keep the default Railpack builder. The included `railway.json` makes Railway run `npm start` and healthcheck `/`.
6. In the backend service **Variables**, add the production variables:
   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/surge
   JWT_SECRET=<strong-random-secret>
   RAZORPAY_KEY_ID=<your_razorpay_key_id>
   RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your_email>
   SMTP_PASS=<your_app_password>
   ALLOWED_ORIGINS=https://surge-drab-one.vercel.app
   ```
   Do not set `PORT`; Railway injects it automatically.
7. After the deployment succeeds, open the service **Settings** -> **Networking** and generate a Railway domain.
8. Set the frontend environment variable `VITE_API_URL` to the backend API URL, for example:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

### Deploying on Replit
1. Open up **Replit** and import your GitHub Repository.
2. In the Replit **Secrets (Environment Variables)** sidebar, add all your variables (like `MONGO_URI`, `JWT_SECRET`, etc).
3. Replit will automatically detect the Node project and run `npm start` when you click "Run".

Your SURGE Backend is now production-ready and fully scalable! 🚀
