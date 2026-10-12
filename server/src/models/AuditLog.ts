import mongoose, { Document, Schema, Types } from 'mongoose';

export type AuditAction = 'ISSUE' | 'REVOKE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'EXPORT_PDF';

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;
  actorEmail?: string;
  action: AuditAction;
  certificateId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    actorEmail: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      enum: ['ISSUE', 'REVOKE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT_PDF'],
      index: true,
    },
    certificateId: {
      type: String,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // append-only
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
