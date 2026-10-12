import { Router } from 'express';
import { VerifyController } from '../controllers/verifyController.js';
import { verifyLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/:certificateId', verifyLimiter, VerifyController.verifyCertificate);

export default router;
