import { Response } from 'express';
import crypto from 'crypto';
import { Certificate } from '../models/Certificate.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';
import { PDFService } from '../services/pdfService.js';
import { QRService } from '../services/qrService.js';

export class CertificateController {
  /**
   * Helper to generate a collision-resistant certificate ID
   * E.g. "DC6E30F05C735E02" or custom
   */
  private static generateUniqueCertificateId(): string {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
  }

  public static async createCertificate(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const input = req.body;

      // Determine Certificate ID
      let certId = input.certificateId?.trim().toUpperCase();
      if (!certId) {
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
          certId = CertificateController.generateUniqueCertificateId();
          const existing = await Certificate.findOne({ certificateId: certId });
          if (!existing) isUnique = true;
          attempts++;
        }
      } else {
        const existing = await Certificate.findOne({ certificateId: certId });
        if (existing) {
          res.status(409).json({
            success: false,
            message: `Certificate with ID '${certId}' already exists.`,
          });
          return;
        }
      }

      const issueDate = input.issueDate ? new Date(input.issueDate) : new Date();
      const completionDate = new Date(input.completionDate);
      const startDate = input.startDate ? new Date(input.startDate) : undefined;

      const certificate = new Certificate({
        certificateId: certId,
        recipientName: input.recipientName,
        recipientEmail: input.recipientEmail || undefined,
        certificateType: input.certificateType,
        achievementTitle: input.achievementTitle,
        domain: input.domain || input.achievementTitle,
        duration: input.duration || '6 Weeks',
        description: input.description,
        remarks: input.remarks,
        issuingOrganization: input.issuingOrganization || 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
        startDate,
        completionDate,
        issueDate,
        grade: input.grade || 'Successfully Completed',
        signatoryName: input.signatoryName || 'NEELA SANTHOSH KUMAR',
        signatoryDesignation: input.signatoryDesignation || 'Human Resources & Academic Head',
        signatoryEmail: input.signatoryEmail || 'hr@codtechitsolutions.com',
        status: 'valid',
        issuedBy: req.user._id,
        allowPublicDownload: input.allowPublicDownload !== false,
      });

      await certificate.save();

      // Audit Log
      await AuditService.log({
        actorId: req.user._id.toString(),
        actorEmail: req.user.email,
        action: 'ISSUE',
        certificateId: certificate.certificateId,
        metadata: {
          recipientName: certificate.recipientName,
          certificateType: certificate.certificateType,
          achievementTitle: certificate.achievementTitle,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Certificate issued successfully',
        certificate,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'A certificate with this ID already exists.',
        });
        return;
      }
      console.error('[CertificateController.createCertificate] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to issue certificate',
      });
    }
  }

  public static async getCertificateById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { certificateId } = req.params;
      const certificate = await Certificate.findOne({
        certificateId: certificateId.toUpperCase(),
      }).populate('issuedBy', 'name email');

      if (!certificate) {
        res.status(404).json({
          success: false,
          message: 'Certificate not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        certificate,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching certificate details',
      });
    }
  }

  public static async getCertificatePdf(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { certificateId } = req.params;
      const certificate = await Certificate.findOne({
        certificateId: certificateId.toUpperCase(),
      });

      if (!certificate) {
        res.status(404).json({
          success: false,
          message: 'Certificate not found',
        });
        return;
      }

      // Record audit log for export
      await AuditService.log({
        actorId: req.user ? req.user._id.toString() : undefined,
        actorEmail: req.user ? req.user.email : 'public-viewer',
        action: 'EXPORT_PDF',
        certificateId: certificate.certificateId,
      });

      const doc = await PDFService.generateCertificatePDF(certificate);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="Certificate-${certificate.certificateId}.pdf"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('[CertificateController.getCertificatePdf] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate certificate PDF',
      });
    }
  }

  public static async getCertificateQr(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { certificateId } = req.params;
      const certificate = await Certificate.findOne({
        certificateId: certificateId.toUpperCase(),
      });

      if (!certificate) {
        res.status(404).json({
          success: false,
          message: 'Certificate not found',
        });
        return;
      }

      const qrDataUrl = await QRService.generateQRDataURL(certificate.certificateId);
      const verificationUrl = QRService.getVerificationUrl(certificate.certificateId);

      res.status(200).json({
        success: true,
        certificateId: certificate.certificateId,
        verificationUrl,
        qrDataUrl,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate QR code',
      });
    }
  }
}
