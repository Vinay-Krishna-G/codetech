export type CertificateType =
  | 'Internship Experience'
  | 'Project Completion'
  | 'Training Completion'
  | 'Workshop Participation'
  | 'Assessment Achievement'
  | 'Course Completion';

export type CertificateStatus = 'valid' | 'revoked';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface Certificate {
  _id?: string;
  certificateId: string;
  recipientName: string;
  recipientEmail?: string;
  certificateType: CertificateType;
  achievementTitle: string;
  domain?: string;
  duration?: string;
  description?: string;
  remarks?: string;
  issuingOrganization: string;
  startDate?: string;
  completionDate: string;
  issueDate: string;
  grade?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  signatoryEmail?: string;
  status: CertificateStatus;
  issuedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  revokedAt?: string;
  revocationReason?: string;
  revokedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  allowPublicDownload?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  _id: string;
  actorId?: {
    name: string;
    email: string;
    role: string;
  };
  actorEmail?: string;
  action: 'ISSUE' | 'REVOKE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'EXPORT_PDF';
  certificateId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DashboardStats {
  totalIssued: number;
  activeCertificates: number;
  revokedCertificates: number;
  byType: { type: string; count: number }[];
  recentIssued: Certificate[];
  recentActivity: AuditLog[];
}

export interface VerifyResponse {
  success: boolean;
  status: 'valid' | 'revoked' | 'not_found' | 'invalid_query';
  message: string;
  certificate?: Certificate;
  searchedId?: string;
}
