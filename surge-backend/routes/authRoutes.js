import express from 'express';
import { signupUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { signupRules, loginRules } from '../validators/authValidator.js';
import { validate } from '../validators/validate.js';

const router = express.Router();

router.post('/signup', signupRules, validate, signupUser);
router.post('/login', loginRules, validate, loginUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
