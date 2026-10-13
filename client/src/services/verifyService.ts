import api from './api';
import type { VerifyResponse } from '../types';

export const verifyService = {
  verifyCertificate: async (certificateId: string): Promise<VerifyResponse> => {
    try {
      const res = await api.get(`/verify/${certificateId}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.data && typeof error.response.data === 'object') {
        const resData = error.response.data;
        return {
          success: false,
          status: resData.status || (error.response.status === 404 ? 'not_found' : 'error'),
          message: resData.message || (error.response.status === 404 ? 'Certificate not found in registry.' : 'Could not connect to the verification registry.'),
          searchedId: resData.searchedId || certificateId,
        };
      }
      return {
        success: false,
        status: error.response?.status === 404 ? 'not_found' : 'error',
        message: 'Could not connect to the verification registry. Please check your network connection.',
        searchedId: certificateId,
      };
    }
  },
};
