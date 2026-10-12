import api from './api';
import type { VerifyResponse } from '../types';

export const verifyService = {
  verifyCertificate: async (certificateId: string): Promise<VerifyResponse> => {
    try {
      const res = await api.get(`/verify/${certificateId}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as VerifyResponse;
      }
      return {
        success: false,
        status: 'not_found',
        message: 'Could not connect to verification server or certificate was not found.',
      };
    }
  },
};
