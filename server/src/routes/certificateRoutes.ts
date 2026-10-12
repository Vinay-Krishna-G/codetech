import { Router } from 'express';
import { CertificateController } from '../controllers/certificateController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createCertificateSchema } from '../validators/certificate.validator.js';

const router = Router();

// Protected issuance
router.post(
  '/',
  authenticateJwt,
  requireAdmin,
  validateBody(createCertificateSchema),
  CertificateController.createCertificate
);

// Certificate metadata, PDF, QR
router.get('/:certificateId', CertificateController.getCertificateById);
router.get('/:certificateId/pdf', CertificateController.getCertificatePdf);
router.get('/:certificateId/qr', CertificateController.getCertificateQr);

export default router;
