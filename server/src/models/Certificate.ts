import mongoose, { Document, Schema, Types } from 'mongoose';

export type CertificateType =
  | 'Internship Experience'
  | 'Project Completion'
  | 'Training Completion'
  | 'Workshop Participation'
  | 'Assessment Achievement'
  | 'Course Completion';

export type CertificateStatus = 'valid' | 'revoked';

export interface ICertificate extends Document {
  certificateId: string;
  recipientName: string;
  recipientEmail?: string;
  certificateType: CertificateType;
  achievementTitle: string;
  domain?: string;
  duration?: string;
  description?: string;
  remarks?: string;
  issuerId?: Types.ObjectId;
  issuingOrganization: string;
  startDate?: Date;
  completionDate: Date;
  issueDate: Date;
  grade?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  signatoryEmail?: string;
  status: CertificateStatus;
  issuedBy: Types.ObjectId;
  revokedAt?: Date;
  revocationReason?: string;
  revokedBy?: Types.ObjectId;
  allowPublicDownload: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    recipientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    certificateType: {
      type: String,
      required: true,
      enum: [
        'Internship Experience',
        'Project Completion',
        'Training Completion',
        'Workshop Participation',
        'Assessment Achievement',
        'Course Completion',
      ],
      index: true,
    },
    achievementTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    remarks: {
      type: String,
      trim: true,
      default: 'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout.',
    },
    issuerId: {
      type: Schema.Types.ObjectId,
      ref: 'Issuer',
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true,
      default: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    grade: {
      type: String,
      trim: true,
      default: 'Successfully Completed',
    },
    signatoryName: {
      type: String,
      trim: true,
      default: 'NEELA SANTHOSH KUMAR',
    },
    signatoryDesignation: {
      type: String,
      trim: true,
      default: 'Human Resources & Academic Head',
    },
    signatoryEmail: {
      type: String,
      trim: true,
      default: 'hr@codtechitsolutions.com',
    },
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid',
      index: true,
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revokedAt: {
      type: Date,
    },
    revocationReason: {
      type: String,
      trim: true,
    },
    revokedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    allowPublicDownload: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CertificateSchema.index({ recipientName: 'text', achievementTitle: 'text', certificateId: 'text' });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
