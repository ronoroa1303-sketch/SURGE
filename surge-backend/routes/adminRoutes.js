import express from 'express';
import {
  getUsers,
  getOrders,
  updateOrderStatus,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protect and admin to all routes in this file
router.use(protect, admin);

router.get('/users', getUsers);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getAnalytics);

export default router;
