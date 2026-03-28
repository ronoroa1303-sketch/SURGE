import express from 'express';
import { createOrder, getOrderById, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createOrderRules } from '../validators/orderValidator.js';
import { validate } from '../validators/validate.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrderRules, validate, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

export default router;
