import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { revokeCertificateSchema } from '../validators/certificate.validator.js';

const router = Router();

// All admin routes require JWT and Admin role
router.use(authenticateJwt, requireAdmin);

router.get('/certificates', AdminController.getCertificates);
router.get('/stats', AdminController.getStats);
router.patch(
  '/certificates/:certificateId/revoke',
  validateBody(revokeCertificateSchema),
  AdminController.revokeCertificate
);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
