import { z } from 'zod';

export const certificateTypes = [
  'Internship Experience',
  'Project Completion',
  'Training Completion',
  'Workshop Participation',
  'Assessment Achievement',
  'Course Completion',
] as const;

export const createCertificateSchema = z
  .object({
    certificateId: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, 'Certificate ID must be at least 3 characters')
      .max(30, 'Certificate ID cannot exceed 30 characters')
      .optional(),
    recipientName: z
      .string()
      .trim()
      .min(2, 'Recipient full name must be at least 2 characters')
      .max(120, 'Recipient name is too long'),
    recipientEmail: z
      .string()
      .trim()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    certificateType: z.enum(certificateTypes, {
      errorMap: () => ({ message: 'Please select a valid certificate type' }),
    }),
    achievementTitle: z
      .string()
      .trim()
      .min(2, 'Achievement or project title is required')
      .max(200, 'Title cannot exceed 200 characters'),
    domain: z.string().trim().max(100).optional().default(''),
    duration: z.string().trim().max(50).optional().default(''),
    description: z.string().trim().max(1000).optional().default(''),
    remarks: z.string().trim().max(1000).optional().default(''),
    issuingOrganization: z
      .string()
      .trim()
      .min(2, 'Issuing organization is required')
      .default('CODTECH IT SOLUTIONS PRIVATE LIMITED'),
    startDate: z.string().optional().or(z.literal('')),
    completionDate: z.string().min(1, 'Completion date is required'),
    issueDate: z.string().optional().or(z.literal('')),
    grade: z.string().trim().max(50).optional().default('Successfully Completed'),
    signatoryName: z.string().trim().max(100).optional().default('NEELA SANTHOSH KUMAR'),
    signatoryDesignation: z
      .string()
      .trim()
      .max(100)
      .optional()
      .default('Human Resources & Academic Head'),
    signatoryEmail: z
      .string()
      .trim()
      .email('Invalid signatory email')
      .optional()
      .or(z.literal(''))
      .default('hr@codtechitsolutions.com'),
    allowPublicDownload: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      const compDate = new Date(data.completionDate);
      const issDate = data.issueDate ? new Date(data.issueDate) : new Date();
      if (isNaN(compDate.getTime()) || isNaN(issDate.getTime())) return false;
      return compDate.getTime() <= issDate.getTime() + 86400000; // allow same day
    },
    {
      message: 'Completion date cannot be after the issue date',
      path: ['completionDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate) return true;
      const stDate = new Date(data.startDate);
      const compDate = new Date(data.completionDate);
      if (isNaN(stDate.getTime()) || isNaN(compDate.getTime())) return false;
      return stDate.getTime() <= compDate.getTime();
    },
    {
      message: 'Start date cannot be after completion date',
      path: ['startDate'],
    }
  );

export const revokeCertificateSchema = z.object({
  revocationReason: z
    .string()
    .trim()
    .min(5, 'Revocation reason must be at least 5 characters')
    .max(500, 'Revocation reason cannot exceed 500 characters'),
});

export const queryCertificateSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  type: z.string().trim().optional(),
  status: z.enum(['all', 'valid', 'revoked']).default('all'),
  sortBy: z.enum(['createdAt', 'issueDate', 'recipientName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
export type RevokeCertificateInput = z.infer<typeof revokeCertificateSchema>;
export type QueryCertificateInput = z.infer<typeof queryCertificateSchema>;
