import QRCode from 'qrcode';
import { env } from '../config/env.js';

export class QRService {
  public static getVerificationUrl(certificateId: string): string {
    return `${env.APP_URL}/verify/${certificateId}`;
  }

  public static async generateQRDataURL(certificateId: string): Promise<string> {
    const url = this.getVerificationUrl(certificateId);
    return QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  }

  public static async generateQRBuffer(certificateId: string): Promise<Buffer> {
    const url = this.getVerificationUrl(certificateId);
    return QRCode.toBuffer(url, {
      type: 'png',
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  }
}
