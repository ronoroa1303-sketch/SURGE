import { body } from 'express-validator';

export const addToCartRules = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('qty')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be an integer between 1 and 100'),
];
