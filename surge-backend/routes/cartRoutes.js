import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { addToCartRules } from '../validators/cartValidator.js';
import { validate } from '../validators/validate.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCartRules, validate, addToCart);

router.route('/:productId')
  .delete(protect, removeFromCart);

export default router;
