// server/routes/coupons.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons,
  toggleCouponActive
} from '../controllers/couponController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Validation rules
const couponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code can only contain uppercase letters and numbers'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be percentage or fixed'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumOrderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a positive number'),
  body('maximumDiscountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount amount must be a positive number'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1')
];

// Public routes
router.get('/active', getActiveCoupons);

// Protected routes
router.post('/validate', auth, validateCoupon);

// Admin routes
router.post('/', auth, admin, couponValidation, createCoupon);
router.get('/', auth, admin, getCoupons);
router.get('/:id', auth, admin, getCoupon);
router.put('/:id', auth, admin, couponValidation, updateCoupon);
router.delete('/:id', auth, admin, deleteCoupon);
router.patch('/:id/toggle', auth, admin, toggleCouponActive);

export default router;