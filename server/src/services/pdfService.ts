import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ICertificate } from '../models/Certificate.js';
import { QRService } from './qrService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveAssetPath = (filename: string): string => {
  const primaryPath = path.resolve(process.cwd(), 'assets', filename);
  if (fs.existsSync(primaryPath)) return primaryPath;
  const secondaryPath = path.resolve(__dirname, '../../assets', filename);
  if (fs.existsSync(secondaryPath)) return secondaryPath;
  const clientPath = path.resolve(process.cwd(), '../client/public/assets', filename);
  if (fs.existsSync(clientPath)) return clientPath;
  return primaryPath;
};

export class PDFService {
  /**
   * Generates a high quality PDF stream matching the authentic Codtech certificate styling
   */
  public static async generateCertificatePDF(certificate: ICertificate): Promise<InstanceType<typeof PDFDocument>> {
    const doc = new PDFDocument({
      size: 'A4', // 595.28 x 841.89 points
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title: `Certificate - ${certificate.recipientName} (${certificate.certificateId})`,
        Author: certificate.issuingOrganization,
        Subject: `${certificate.certificateType} - ${certificate.achievementTitle}`,
        Keywords: 'Certificate, Verification, Authenticity, Codtech',
      },
    });

    const pageWidth = 595.28;
    const pageHeight = 841.89;

    // 0. Watermark in background with authentic CT emblem
    const wmPath = resolveAssetPath('watermark.png');
    if (fs.existsSync(wmPath)) {
      doc.save();
      doc.opacity(0.06);
      doc.image(wmPath, (pageWidth - 200) / 2, (pageHeight - 180) / 2, { width: 200 });
      doc.restore();
    }

    // 1. Draw Geometric Border Accents (Orange, Gold, Black polygons like Image 1)
    // Top-Left corner geometric accents
    doc.save();
    doc
      .polygon([0, 0], [150, 0], [0, 45])
      .fill('#e67e22'); // Amber / Orange
    doc
      .polygon([0, 0], [80, 0], [0, 80])
      .fill('#f39c12'); // Golden Orange
    doc
      .polygon([0, 45], [90, 0], [0, 60])
      .fill('#2c3e50'); // Dark accent

    // Top-Right corner geometric accents
    doc
      .polygon([pageWidth, 0], [pageWidth - 150, 0], [pageWidth, 45])
      .fill('#e67e22');
    doc
      .polygon([pageWidth, 0], [pageWidth - 80, 0], [pageWidth, 80])
      .fill('#f39c12');
    doc
      .polygon([pageWidth, 45], [pageWidth - 90, 0], [pageWidth, 60])
      .fill('#2c3e50');

    // Bottom-Left corner accents
    doc
      .polygon([0, pageHeight], [150, pageHeight], [0, pageHeight - 45])
      .fill('#e67e22');
    doc
      .polygon([0, pageHeight], [80, pageHeight], [0, pageHeight - 80])
      .fill('#f39c12');
    doc
      .polygon([0, pageHeight - 45], [90, pageHeight], [0, pageHeight - 60])
      .fill('#1a1a1a');

    // Bottom-Right corner accents
    doc
      .polygon([pageWidth, pageHeight], [pageWidth - 150, pageHeight], [pageWidth, pageHeight - 45])
      .fill('#e67e22');
    doc
      .polygon([pageWidth, pageHeight], [pageWidth - 80, pageHeight], [pageWidth, pageHeight - 80])
      .fill('#f39c12');
    doc
      .polygon([pageWidth, pageHeight - 45], [pageWidth - 90, pageHeight], [pageWidth, pageHeight - 60])
      .fill('#1a1a1a');

    // Thin inner border frame
    doc
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .lineWidth(1)
      .strokeColor('#f1c40f')
      .stroke();
    doc.restore();

    // 2. Header Area
    const headerY = 50;
    const logoPath = resolveAssetPath('codtech_logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 42, headerY - 2, { width: 48 });
    } else {
      doc.save();
      doc.roundedRect(42, headerY, 44, 44, 6).fill('#111827');
      doc.circle(64, headerY + 22, 14).lineWidth(2).strokeColor('#e67e22').stroke();
      doc
        .fillColor('#ffffff')
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('CT', 52, headerY + 14, { width: 24, align: 'center' });
      doc
        .fillColor('#111827')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('CODTECH', 40, headerY + 48, { width: 48, align: 'center' });
      doc.restore();
    }

    // Company Title & Address
    doc
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(certificate.issuingOrganization || 'CODTECH IT SOLUTIONS PRIVATE LIMITED', 95, headerY + 4, {
        width: 390,
      });

    doc
      .fillColor('#4b5563')
      .font('Helvetica')
      .fontSize(7.5)
      .text(
        '8-7-7/2, Plot NO.51, Opp: Naveena School, Hasthinapuram Central, Hyderabad, 500 079. Telangana',
        95,
        headerY + 26,
        { width: 380, lineGap: 1 }
      );

    // QR Code top right
    try {
      const qrBuffer = await QRService.generateQRBuffer(certificate.certificateId);
      doc.image(qrBuffer, pageWidth - 105, headerY - 5, { width: 62, height: 62 });
      doc
        .fontSize(6)
        .fillColor('#6b7280')
        .text('Scan to verify', pageWidth - 105, headerY + 59, { width: 62, align: 'center' });
    } catch (err) {
      console.error('[PDFService] QR generation error:', err);
    }

    // 3. Certificate Title Section
    const titleY = headerY + 80;
    doc
      .fillColor('#b8860b') // Dark goldenrod
      .font('Helvetica-Bold')
      .fontSize(28)
      .text('C E R T I F I C A T E', 40, titleY, { align: 'center', width: pageWidth - 80 });

    const certSubtitle =
      certificate.certificateType === 'Internship Experience'
        ? 'OF INTERNSHIP EXPERIENCE'
        : `OF ${certificate.certificateType.toUpperCase()}`;

    doc
      .fillColor('#2d3748')
      .font('Helvetica-Bold')
      .fontSize(13)
      .text(certSubtitle, 40, titleY + 32, { align: 'center', width: pageWidth - 80 });

    // Salutation
    doc
      .fillColor('#1f2937')
      .font('Times-Bold')
      .fontSize(15)
      .text('To whom so ever it may concern', 40, titleY + 58, { align: 'center', width: pageWidth - 80 });

    // 4. Details Table / List
    const detailsStartY = titleY + 95;
    const labelX = 55;
    const valueX = 175;
    let currentY = detailsStartY;
    const lineSpacing = 19;

    const formatDate = (d?: Date) => {
      if (!d) return '';
      return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const periodStr = certificate.startDate
      ? `${formatDate(certificate.startDate)} - ${formatDate(certificate.completionDate)}`
      : formatDate(certificate.completionDate);

    const rows: { label: string; value: string; isBold?: boolean }[] = [
      { label: 'Intern Name:', value: certificate.recipientName.toUpperCase(), isBold: true },
      { label: 'Intern ID:', value: certificate.certificateId, isBold: true },
      { label: 'Program Type:', value: certificate.certificateType },
      { label: 'Duration:', value: certificate.duration || '6 Weeks' },
      { label: 'Domain:', value: certificate.domain || certificate.achievementTitle },
      { label: 'Organization:', value: certificate.issuingOrganization },
      { label: 'Internship Period:', value: periodStr },
      { label: 'Status:', value: certificate.grade || 'Successfully Completed' },
      {
        label: 'Remarks:',
        value:
          certificate.remarks ||
          'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.',
      },
    ];

    rows.forEach((row) => {
      doc
        .fillColor('#1f2937')
        .font('Helvetica-Bold')
        .fontSize(10.5)
        .text(row.label, labelX, currentY, { width: 115 });

      doc
        .fillColor('#111827')
        .font(row.isBold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(10.5)
        .text(row.value, valueX, currentY, { width: pageWidth - valueX - 55 });

      // Calculate height in case remarks wraps
      const textHeight = doc.heightOfString(row.value, {
        width: pageWidth - valueX - 55,
      });
      currentY += Math.max(lineSpacing, textHeight + 4);
    });

    // 5. Commendation / Appreciation Paragraphs
    currentY += 8;
    const desc =
      certificate.description ||
      'We appreciate his/her active participation, consistent efforts, and impressive contribution to the overall success of the internship. We wish him/her all the best in future endeavors.';

    doc
      .fillColor('#2d3748')
      .font('Helvetica')
      .fontSize(9.5)
      .text(desc, 55, currentY, { width: pageWidth - 110, lineGap: 3, align: 'justify' });

    currentY += 36;
    doc
      .fillColor('#2d3748')
      .font('Helvetica')
      .fontSize(9.5)
      .text('We are confident that his/her dedication and skills will lead to great achievements ahead.', 55, currentY, {
        width: pageWidth - 110,
        align: 'justify',
      });

    // 6. Signatures and Trust Badges (Matching bottom of Image 1)
    const footerStartY = pageHeight - 160;

    // Left: Authorized Signatory
    const sigPath = resolveAssetPath('signature.png');
    if (fs.existsSync(sigPath)) {
      doc.image(sigPath, 52, footerStartY - 10, { width: 90 });
    }

    doc.save();
    doc
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text('Best Wishes,', 52, footerStartY + 32);

    doc
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .text(certificate.signatoryName || 'NEELA SANTHOSH KUMAR', 52, footerStartY + 45);

    doc
      .fillColor('#4b5563')
      .font('Helvetica')
      .fontSize(8)
      .text(certificate.signatoryDesignation || 'Human Resources & Academic Head', 52, footerStartY + 58);

    doc
      .fillColor('#2563eb')
      .font('Helvetica')
      .fontSize(8)
      .text(certificate.signatoryEmail || 'hr@codtechitsolutions.com', 52, footerStartY + 70);
    doc.restore();

    // Center & Right: Authentic seals matching reference certificate (Codtech seal, ISO 9001, AICTE, MSME)
    const sealCodtechPath = resolveAssetPath('seal_codtech.png');
    const sealIsoPath = resolveAssetPath('seal_iso.png');
    const sealAictePath = resolveAssetPath('seal_aicte.png');
    const sealMsmePath = resolveAssetPath('seal_msme.png');
    const startupIndiaPath = resolveAssetPath('startupindia.png');

    const sealY = footerStartY + 5;
    const sealSize = 52;

    if (fs.existsSync(sealCodtechPath)) {
      doc.image(sealCodtechPath, 260, sealY, { width: sealSize, height: sealSize });
    }
    if (fs.existsSync(sealIsoPath)) {
      doc.image(sealIsoPath, 330, sealY, { width: sealSize, height: sealSize });
    }
    if (fs.existsSync(sealAictePath)) {
      doc.image(sealAictePath, 400, sealY, { width: sealSize, height: sealSize });
    }
    if (fs.existsSync(sealMsmePath)) {
      doc.image(sealMsmePath, 340, sealY + 58, { width: 75 });
    }

    // Bottom Branding: #startupindia
    if (fs.existsSync(startupIndiaPath)) {
      const startupW = 110;
      doc.image(startupIndiaPath, (pageWidth - startupW) / 2, pageHeight - 55, { width: startupW });
    } else {
      doc
        .fillColor('#ea580c')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('#startupindia', 40, pageHeight - 50, { width: pageWidth - 80, align: 'center' });
    }

    // Watermark if Revoked
    if (certificate.status === 'revoked') {
      doc.save();
      doc.rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
      doc
        .fillColor('#dc2626')
        .opacity(0.35)
        .font('Helvetica-Bold')
        .fontSize(52)
        .text('CERTIFICATE REVOKED', 0, pageHeight / 2 - 40, {
          width: pageWidth,
          align: 'center',
        });
      doc
        .fontSize(18)
        .text(
          `Revoked on ${formatDate(certificate.revokedAt)} - Reason: ${certificate.revocationReason || 'Invalidated by Administrator'}`,
          0,
          pageHeight / 2 + 30,
          { width: pageWidth, align: 'center' }
        );
      doc.restore();
    }

    return doc;
  }
}
