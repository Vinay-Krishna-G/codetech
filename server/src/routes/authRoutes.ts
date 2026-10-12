import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJwt } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.validator.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, validateBody(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticateJwt, AuthController.getMe);

export default router;
