import { Router } from 'express';
import authRoutes from './authRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import adminRoutes from './adminRoutes.js';
import verifyRoutes from './verifyRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/certificates', certificateRoutes);
router.use('/admin', adminRoutes);
router.use('/verify', verifyRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CertiVerify API',
  });
});

export default router;
