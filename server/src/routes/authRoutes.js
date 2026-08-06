import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';
const router = Router();
router.post('/login', login);
router.get('/me', authenticateJWT, getCurrentUser);
export default router;
