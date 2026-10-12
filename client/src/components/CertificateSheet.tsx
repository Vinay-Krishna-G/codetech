import React from 'react';
import { QrCode, CheckCircle2 } from 'lucide-react';
import type { Certificate } from '../types';

interface CertificateSheetProps {
  certificate: Partial<Certificate>;
  qrDataUrl?: string;
  isRevoked?: boolean;
}

export const CertificateSheet: React.FC<CertificateSheetProps> = ({
  certificate,
  qrDataUrl,
  isRevoked = false,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
  };

  const periodStr = certificate.startDate
    ? `${formatDate(certificate.startDate)} - ${formatDate(certificate.completionDate)}`
    : formatDate(certificate.completionDate);

  const certTypeTitle =
    certificate.certificateType === 'Internship Experience'
      ? 'OF INTERNSHIP EXPERIENCE'
      : `OF ${certificate.certificateType?.toUpperCase() || 'COMPLETION'}`;

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#faf8f5] text-neutral-900 border-[3px] border-[#d4af37] rounded-xl shadow-2xl p-6 sm:p-9 font-sans overflow-hidden select-none">
      {/* Corner Geometric Accents (Gold/Orange/Dark polygons matching Image 1) */}
      <div className="absolute top-0 left-0 w-24 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 [clip-path:polygon(0_0,100%_0,0_100%)] opacity-90 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 [clip-path:polygon(0_0,100%_0,0_100%)] opacity-70 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 h-12 bg-gradient-to-bl from-amber-500 via-orange-500 to-amber-600 [clip-path:polygon(0_0,100%_0,100%_100%)] opacity-90 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-amber-400 to-orange-400 [clip-path:polygon(0_0,100%_0,100%_100%)] opacity-70 pointer-events-none"></div>

      {/* Bottom Corner Geometric Accents */}
      <div className="absolute bottom-0 left-0 w-24 h-12 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 [clip-path:polygon(0_100%,100%_100%,0_0)] opacity-90 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-24 h-12 bg-gradient-to-tl from-amber-500 via-orange-500 to-amber-600 [clip-path:polygon(0_100%,100%_100%,100%_0)] opacity-90 pointer-events-none"></div>

      {/* Inner Thin Border Line */}
      <div className="absolute inset-2 sm:inset-3 border border-[#e5c158]/50 rounded-lg pointer-events-none"></div>

      {/* Watermark background with authentic CT logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none">
        <img
          src="/assets/codtech_logo.png"
          alt=""
          className="w-72 max-w-[55%] object-contain"
        />
      </div>

      {/* Revoked Watermark overlay */}
      {(isRevoked || certificate.status === 'revoked') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/10 backdrop-blur-[1px] rotate-[-25deg] pointer-events-none select-none">
          <div className="border-4 border-red-600/70 text-red-600 font-extrabold text-3xl sm:text-5xl px-8 py-3 rounded-2xl tracking-widest uppercase opacity-85 shadow-lg">
            REVOKED
          </div>
        </div>
      )}

      {/* 1. Header with Logo, Address, and Top-Right QR Code */}
      <div className="relative z-10 flex items-start justify-between border-b border-neutral-200/80 pb-4 mb-4">
        {/* Brand & Address */}
        <div className="flex items-start space-x-3.5 max-w-[75%]">
          {/* Authentic CODTECH CT Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/assets/codtech_logo.png"
              alt="CODTECH Logo"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-xs"
            />
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-black text-neutral-950 uppercase tracking-tight">
              {certificate.issuingOrganization || 'CODTECH IT SOLUTIONS PRIVATE LIMITED'}
            </h2>
            <p className="text-[9px] sm:text-[10px] text-neutral-600 leading-tight mt-0.5 font-normal">
              8-7-7/2, Plot NO.51, Opp: Naveena School, Hasthinapuram Central, Hyderabad, 500 079. Telangana
            </p>
          </div>
        </div>

        {/* QR Code in Top Right */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 p-1 bg-white border border-neutral-300 rounded shadow-sm flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Verify QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-full h-full text-neutral-800" />
            )}
          </div>
          <span className="text-[7px] text-neutral-500 font-medium mt-0.5">Scan to verify</span>
        </div>
      </div>

      {/* 2. Certificate Title */}
      <div className="relative z-10 text-center my-4">
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-[0.25em] text-[#b8860b] uppercase font-serif drop-shadow-sm">
          C E R T I F I C A T E
        </h1>
        <h3 className="text-xs sm:text-sm font-bold text-neutral-800 tracking-wider uppercase mt-1">
          {certTypeTitle}
        </h3>
        <p className="text-xs sm:text-sm italic font-serif text-neutral-700 mt-1 font-semibold">
          To whom so ever it may concern
        </p>
      </div>

      {/* 3. Certificate Particulars Table */}
      <div className="relative z-10 bg-white/70 border border-neutral-200/90 rounded-lg p-3 sm:p-4 my-4 space-y-1.5 text-[11px] sm:text-xs">
        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Intern Name:</span>
          <span className="col-span-8 font-extrabold text-neutral-950 uppercase tracking-wide">
            {certificate.recipientName || 'Candidate Full Name'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Intern ID:</span>
          <span className="col-span-8 font-mono font-bold text-neutral-900">
            {certificate.certificateId || 'CITS24'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Program Type:</span>
          <span className="col-span-8 text-neutral-900 font-medium">
            {certificate.certificateType || 'Internship'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Duration:</span>
          <span className="col-span-8 text-neutral-900 font-medium">
            {certificate.duration || '6 Weeks'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Domain:</span>
          <span className="col-span-8 text-neutral-900 font-semibold">
            {certificate.domain || certificate.achievementTitle || 'Data Analytics'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Organization:</span>
          <span className="col-span-8 text-neutral-900 font-medium">
            {certificate.issuingOrganization || 'CODTECH IT SOLUTIONS PRIVATE LIMITED'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Internship Period:</span>
          <span className="col-span-8 text-neutral-900 font-medium">{periodStr}</span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5 border-b border-neutral-100">
          <span className="col-span-4 font-bold text-neutral-800">Status:</span>
          <span className="col-span-8 font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
            {certificate.grade || 'Successfully Completed'}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-1 py-0.5">
          <span className="col-span-4 font-bold text-neutral-800">Remarks:</span>
          <span className="col-span-8 text-neutral-800 italic leading-snug">
            {certificate.remarks ||
              'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.'}
          </span>
        </div>
      </div>

      {/* 4. Commendation / Appreciation Paragraphs */}
      <div className="relative z-10 text-[10px] sm:text-[11px] text-neutral-700 space-y-1.5 leading-relaxed text-justify mb-5">
        <p>
          {certificate.description ||
            'We appreciate his/her active participation, consistent efforts, and impressive contribution to the overall success of the internship. We wish him/her all the best in future endeavors.'}
        </p>
        <p>
          We are confident that his/her dedication and skills will lead to great achievements ahead.
        </p>
      </div>

      {/* 5. Signatures and Badges Footer */}
      <div className="relative z-10 pt-3 border-t border-neutral-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Authorized Signatory with authentic handwritten signature */}
        <div className="text-left w-full sm:w-auto">
          {/* Authentic Handwritten Signature */}
          <div className="h-11 flex items-center mb-0.5">
            <img
              src="/assets/signature.png"
              alt={certificate.signatoryName || 'Neela Santhosh Kumar'}
              className="h-11 w-auto object-contain drop-shadow-xs"
            />
          </div>
          <div className="text-[10px] font-bold text-neutral-900 uppercase">
            Best Wishes,
          </div>
          <div className="text-[11px] font-black text-neutral-900 uppercase tracking-tight">
            {certificate.signatoryName || 'NEELA SANTHOSH KUMAR'}
          </div>
          <div className="text-[9px] text-neutral-600 font-medium">
            {certificate.signatoryDesignation || 'Human Resources & Academic Head'}
          </div>
          <div className="text-[9px] text-blue-700 font-medium">
            {certificate.signatoryEmail || 'hr@codtechitsolutions.com'}
          </div>
        </div>

        {/* Right: Authentic Trust Seals & Badges */}
        <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/assets/seal_codtech.png"
              alt="CODTECH Corporate Seal"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs"
              title="CODTECH IT SOLUTIONS Verified Seal"
            />
            <img
              src="/assets/seal_iso.png"
              alt="ISO 9001 Certified"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs"
              title="ISO 9001:2015 Certified"
            />
            <img
              src="/assets/seal_aicte.png"
              alt="AICTE Council"
              className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs"
              title="AICTE Recognized Partner"
            />
          </div>

          <div className="flex items-center justify-end pr-1">
            <img
              src="/assets/seal_msme.png"
              alt="MSME Govt of India"
              className="h-5 sm:h-6 w-auto object-contain"
              title="Ministry of MSME Govt. of India"
            />
          </div>
        </div>
      </div>

      {/* 6. #startupindia Official Recognition Banner */}
      <div className="relative z-10 flex justify-center pt-2 sm:pt-3">
        <img
          src="/assets/startupindia.png"
          alt="#startupindia"
          className="h-5 sm:h-6 w-auto object-contain"
          title="#startupindia Recognized"
        />
      </div>
    </div>
  );
};
