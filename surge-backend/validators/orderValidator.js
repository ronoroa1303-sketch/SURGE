import { body } from 'express-validator';

export const createOrderRules = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order items cannot be empty'),
  body('orderItems.*.product').isMongoId().withMessage('Invalid product ID in order items'),
  body('orderItems.*.qty')
    .isInt({ min: 1, max: 100 })
    .withMessage('Item quantity must be between 1 and 100'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
];

export const updateOrderStatusRules = [
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'delivered'])
    .withMessage('Status must be one of: pending, paid, shipped, delivered'),
];
