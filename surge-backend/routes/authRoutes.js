import express from 'express';
import { signupUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
