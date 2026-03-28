import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import checkEnvVars from './config/env.js';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import preorderRoutes from './routes/preorderRoutes.js';

// Load environment variables
dotenv.config();

// Validate Environment Variables
checkEnvVars();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));

app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP to auth routes, please try again later.'
});
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many payment requests from this IP, please try again later.'
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Basic Healthcheck Route
app.get('/', (req, res) => {
  res.send('SURGE D2C API is running...');
});

// Mount Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/payment', paymentLimiter, paymentRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/cart', apiLimiter, cartRoutes);
app.use('/api/order', apiLimiter, orderRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/preorder', apiLimiter, preorderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('Received kill signal, shutting down gracefully');
  server.close(async () => {
    console.log('HTTP server closed');
    await mongoose.connection.close();
    console.log('Mongoose connection closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); // force kill after 10 seconds
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
