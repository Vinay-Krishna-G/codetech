import api from './api';
import type { Certificate, DashboardStats, AuditLog } from '../types';

export const certificateService = {
  createCertificate: async (data: any): Promise<{ certificate: Certificate }> => {
    const res = await api.post('/certificates', data);
    return res.data;
  },

  getCertificateById: async (id: string): Promise<{ certificate: Certificate }> => {
    const res = await api.get(`/certificates/${id}`);
    return res.data;
  },

  getCertificates: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    certificates: Certificate[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await api.get('/admin/certificates', { params });
    return res.data;
  },

  getStats: async (): Promise<{ stats: DashboardStats }> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  revokeCertificate: async (
    certificateId: string,
    revocationReason: string
  ): Promise<{ certificate: Certificate }> => {
    const res = await api.patch(`/admin/certificates/${certificateId}/revoke`, {
      revocationReason,
    });
    return res.data;
  },

  getAuditLogs: async (params: {
    page?: number;
    limit?: number;
    action?: string;
    certificateId?: string;
  }): Promise<{
    logs: AuditLog[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },

  getPdfUrl: (certificateId: string): string => {
    const base = import.meta.env.VITE_API_URL || '/api';
    return `${base}/certificates/${certificateId}/pdf`;
  },

  getQrData: async (
    certificateId: string
  ): Promise<{ qrDataUrl: string; verificationUrl: string }> => {
    const res = await api.get(`/certificates/${certificateId}/qr`);
    return res.data;
  },
};
