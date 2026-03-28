import express from 'express';
import { createPreorder } from '../controllers/preorderController.js';
import { body } from 'express-validator';
import { validate } from '../validators/validate.js';

const router = express.Router();

const preorderRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

router.post('/', preorderRules, validate, createPreorder);

export default router;
