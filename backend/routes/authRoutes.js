import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes cover signup, login, and the current session lookup.
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
