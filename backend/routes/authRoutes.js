import express from 'express';
import {
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  registerUser,
  loginUser
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/verify', protect, sendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
