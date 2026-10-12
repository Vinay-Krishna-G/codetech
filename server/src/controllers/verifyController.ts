import { Request, Response } from 'express';
import { Certificate } from '../models/Certificate.js';
import { AuditService } from '../services/auditService.js';

export class VerifyController {
  public static async verifyCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { certificateId } = req.params;

      if (!certificateId || certificateId.trim().length === 0) {
        res.status(400).json({
          success: false,
          status: 'invalid_query',
          message: 'Certificate ID is required for verification.',
        });
        return;
      }

      const certificate = await Certificate.findOne({
        certificateId: certificateId.trim().toUpperCase(),
      });

      if (!certificate) {
        res.status(404).json({
          success: false,
          status: 'not_found',
          message: `Certificate with ID '${certificateId.trim().toUpperCase()}' was not found in our records.`,
          searchedId: certificateId.trim().toUpperCase(),
        });
        return;
      }

      // Record audit event for verification view
      await AuditService.log({
        actorEmail: 'public-verifier',
        action: 'VIEW',
        certificateId: certificate.certificateId,
        metadata: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          statusAtView: certificate.status,
        },
      });

      if (certificate.status === 'revoked') {
        res.status(200).json({
          success: true,
          status: 'revoked',
          message: 'This certificate has been revoked by the issuing authority.',
          certificate: {
            certificateId: certificate.certificateId,
            recipientName: certificate.recipientName,
            achievementTitle: certificate.achievementTitle,
            certificateType: certificate.certificateType,
            issuingOrganization: certificate.issuingOrganization,
            completionDate: certificate.completionDate,
            issueDate: certificate.issueDate,
            status: certificate.status,
            revokedAt: certificate.revokedAt,
            revocationReason: certificate.revocationReason || 'Invalidated by organization',
            allowPublicDownload: false,
          },
        });
        return;
      }

      // Valid certificate response matching reference visual fields
      res.status(200).json({
        success: true,
        status: 'valid',
        message: 'Valid Certificate Verified',
        certificate: {
          certificateId: certificate.certificateId,
          recipientName: certificate.recipientName,
          recipientEmail: certificate.recipientEmail ? 'Verified (Hidden)' : undefined,
          certificateType: certificate.certificateType,
          achievementTitle: certificate.achievementTitle,
          domain: certificate.domain || certificate.achievementTitle,
          duration: certificate.duration || '6 Weeks',
          description: certificate.description,
          remarks: certificate.remarks,
          issuingOrganization: certificate.issuingOrganization,
          startDate: certificate.startDate,
          completionDate: certificate.completionDate,
          issueDate: certificate.issueDate,
          grade: certificate.grade,
          signatoryName: certificate.signatoryName,
          signatoryDesignation: certificate.signatoryDesignation,
          status: certificate.status,
          allowPublicDownload: certificate.allowPublicDownload,
        },
      });
    } catch (error) {
      console.error('[VerifyController.verifyCertificate] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while verifying certificate.',
      });
    }
  }
}
