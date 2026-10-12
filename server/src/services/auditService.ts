import { AuditLog, AuditAction } from '../models/AuditLog.js';
import { Types } from 'mongoose';

export interface LogAuditParams {
  actorId?: Types.ObjectId | string;
  actorEmail?: string;
  action: AuditAction;
  certificateId?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  public static async log(params: LogAuditParams): Promise<void> {
    try {
      await AuditLog.create({
        actorId: params.actorId ? new Types.ObjectId(params.actorId) : undefined,
        actorEmail: params.actorEmail || 'system',
        action: params.action,
        certificateId: params.certificateId,
        timestamp: new Date(),
        metadata: params.metadata || {},
      });
    } catch (error) {
      // Audit log failures should not crash primary operations, but should be logged to stderr
      console.error('[AuditService Error] Failed to write audit log:', error);
    }
  }
}
