import { Response } from 'express';
import { Certificate } from '../models/Certificate.js';
import { AuditLog } from '../models/AuditLog.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

export class AdminController {
  public static async getCertificates(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const search = (req.query.search as string)?.trim();
      const type = (req.query.type as string)?.trim();
      const status = (req.query.status as string)?.trim();
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      const filter: any = {};

      if (status && status !== 'all') {
        filter.status = status;
      }

      if (type && type !== 'all') {
        filter.certificateType = type;
      }

      if (search) {
        filter.$or = [
          { certificateId: { $regex: search, $options: 'i' } },
          { recipientName: { $regex: search, $options: 'i' } },
          { achievementTitle: { $regex: search, $options: 'i' } },
          { recipientEmail: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await Certificate.countDocuments(filter);
      const certificates = await Certificate.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('issuedBy', 'name email')
        .populate('revokedBy', 'name email');

      res.status(200).json({
        success: true,
        certificates,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      console.error('[AdminController.getCertificates] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching certificates',
      });
    }
  }

  public static async getStats(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // Aggregation queries directly against the database
      const [statsResult, typeResult, recentIssued, recentLogs] = await Promise.all([
        Certificate.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
        Certificate.aggregate([
          {
            $group: {
              _id: '$certificateType',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
        Certificate.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('certificateId recipientName achievementTitle certificateType status createdAt'),
        AuditLog.find()
          .sort({ timestamp: -1 })
          .limit(5)
          .select('action certificateId actorEmail timestamp metadata'),
      ]);

      let totalIssued = 0;
      let activeCertificates = 0;
      let revokedCertificates = 0;

      statsResult.forEach((stat) => {
        totalIssued += stat.count;
        if (stat._id === 'valid') activeCertificates = stat.count;
        if (stat._id === 'revoked') revokedCertificates = stat.count;
      });

      res.status(200).json({
        success: true,
        stats: {
          totalIssued,
          activeCertificates,
          revokedCertificates,
          byType: typeResult.map((t) => ({ type: t._id, count: t.count })),
          recentIssued,
          recentActivity: recentLogs,
        },
      });
    } catch (error) {
      console.error('[AdminController.getStats] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve database statistics',
      });
    }
  }

  public static async revokeCertificate(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { certificateId } = req.params;
      const { revocationReason } = req.body;

      if (!revocationReason || revocationReason.trim().length < 5) {
        res.status(400).json({
          success: false,
          message: 'A mandatory revocation reason (min 5 characters) must be provided.',
        });
        return;
      }

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

      if (certificate.status === 'revoked') {
        res.status(400).json({
          success: false,
          message: 'Certificate is already revoked and cannot be revoked again.',
        });
        return;
      }

      certificate.status = 'revoked';
      certificate.revokedAt = new Date();
      certificate.revocationReason = revocationReason.trim();
      certificate.revokedBy = req.user._id;

      await certificate.save();

      // Record in audit log
      await AuditService.log({
        actorId: req.user._id.toString(),
        actorEmail: req.user.email,
        action: 'REVOKE',
        certificateId: certificate.certificateId,
        metadata: {
          revocationReason: certificate.revocationReason,
          recipientName: certificate.recipientName,
        },
      });

      res.status(200).json({
        success: true,
        message: `Certificate ${certificate.certificateId} has been revoked successfully.`,
        certificate,
      });
    } catch (error) {
      console.error('[AdminController.revokeCertificate] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke certificate',
      });
    }
  }

  public static async getAuditLogs(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
      const action = (req.query.action as string)?.trim();
      const certificateId = (req.query.certificateId as string)?.trim();

      const filter: any = {};
      if (action && action !== 'all') filter.action = action;
      if (certificateId) filter.certificateId = { $regex: certificateId, $options: 'i' };

      const total = await AuditLog.countDocuments(filter);
      const logs = await AuditLog.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('actorId', 'name email role');

      res.status(200).json({
        success: true,
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs',
      });
    }
  }
}
