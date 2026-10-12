import mongoose, { Document, Schema } from 'mongoose';

export interface IIssuer extends Document {
  organizationName: string;
  address?: string;
  contactEmail: string;
  website?: string;
  phone?: string;
  authorizationDescription?: string;
  defaultSignatoryName?: string;
  defaultSignatoryDesignation?: string;
  badges?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const IssuerSchema = new Schema<IIssuer>(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    authorizationDescription: {
      type: String,
      trim: true,
      default: 'Authorized Certification and Verification Authority',
    },
    defaultSignatoryName: {
      type: String,
      trim: true,
      default: '',
    },
    defaultSignatoryDesignation: {
      type: String,
      trim: true,
      default: '',
    },
    badges: {
      type: [String],
      default: ['ISO 9001', 'AICTE', 'MSME', 'StartupIndia'],
    },
  },
  {
    timestamps: true,
  }
);

export const Issuer = mongoose.model<IIssuer>('Issuer', IssuerSchema);
