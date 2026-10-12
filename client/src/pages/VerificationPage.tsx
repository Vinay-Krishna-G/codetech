import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Download,
  QrCode,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileText,
  BadgeCheck,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { verifyService } from '../services/verifyService';
import { certificateService } from '../services/certificateService';
import type { VerifyResponse } from '../types';
import { QrModal } from '../components/QrModal';
import { CertificateSheet } from '../components/CertificateSheet';

export const VerificationPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState<{ qrDataUrl: string; verificationUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Toggle between canonical digital summary view (Image 3) and original certificate sheet (Image 1)
  const [viewMode, setViewMode] = useState<'summary' | 'sheet'>('summary');

  const fetchVerification = async (id: string) => {
    setLoading(true);
    try {
      const res = await verifyService.verifyCertificate(id);
      setData(res);

      if (res.status === 'valid') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });

        // Preload QR code data
        try {
          const qr = await certificateService.getQrData(id);
          setQrData(qr);
        } catch {
          // Ignore non-fatal QR preload errors
        }
      }
    } catch {
      setData({
        success: false,
        status: 'not_found',
        message: 'Could not connect to the verification registry.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      fetchVerification(certificateId);
    }
  }, [certificateId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/verify/${searchInput.trim().toUpperCase()}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] py-16 px-4 flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            Querying live database for certificate{' '}
            <span className="font-mono font-bold text-neutral-900 dark:text-white">{certificateId}</span>...
          </p>
          <p className="text-[11px] text-neutral-400">
            CODTECH IT SOLUTIONS — Central Credential Repository
          </p>
        </div>
      </div>
    );
  }

  const certificate = data?.certificate;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-neutral-100 dark:bg-neutral-950 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-1.5">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Verification Portal
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
              {certificateId}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Verify Another ID
            </Link>
          </div>
        </div>

        {/* VALID CERTIFICATE STATE */}
        {data?.status === 'valid' && certificate && (
          <div className="space-y-4">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-center">
              <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-sm flex space-x-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('summary')}
                  className={`px-4 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                    viewMode === 'summary'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Credential Details (Portal View)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('sheet')}
                  className={`px-4 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                    viewMode === 'sheet'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Original Certificate Document</span>
                </button>
              </div>
            </div>

            {/* View 1: Summary Card matching Image 3 directly */}
            {viewMode === 'summary' ? (
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-in fade-in duration-200">
                {/* Top Blue Header Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 px-6 py-5 text-white text-center relative overflow-hidden">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2 text-lg sm:text-xl font-bold tracking-tight">
                      <div className="w-6 h-6 rounded-full bg-white text-blue-700 flex items-center justify-center font-black text-sm">
                        ✓
                      </div>
                      <span>Valid Certificate Verified</span>
                    </div>

                    <div className="mt-2.5">
                      <span className="inline-block px-3.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Certificate ID Card Banner matching Image 3 */}
                  <div className="rounded-xl p-4 text-center bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white shadow-inner">
                    <span className="block text-[11px] font-medium text-blue-200 tracking-wider uppercase">
                      Certificate ID
                    </span>
                    <span className="block text-xl sm:text-2xl font-mono font-bold tracking-widest mt-0.5 text-white">
                      {certificate.certificateId}
                    </span>
                  </div>

                  {/* Student Information Section */}
                  <div className="space-y-3">
                    <div className="border-b border-blue-500 pb-1 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                        Student Information
                      </h3>
                      <span className="text-[10px] text-neutral-400">Identity Confirmed</span>
                    </div>

                    <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                      <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        STUDENT NAME
                      </span>
                      <span className="block text-base font-bold text-neutral-950 dark:text-white mt-0.5">
                        {certificate.recipientName}
                      </span>
                    </div>
                  </div>

                  {/* Course Details Section */}
                  <div className="space-y-3">
                    <div className="border-b border-blue-500 pb-1 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                        Course Details
                      </h3>
                      <span className="text-[10px] text-neutral-400">Curriculum Records</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          COURSE NAME
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {certificate.achievementTitle}
                        </span>
                      </div>

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          CATEGORY
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {certificate.certificateType}
                        </span>
                      </div>

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          DURATION
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {certificate.duration || '6 Weeks'}
                        </span>
                      </div>

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          COMPANY NAME
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {certificate.issuingOrganization}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Internship Period Section */}
                  <div className="space-y-3">
                    <div className="border-b border-blue-500 pb-1 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                        Internship Period & Status
                      </h3>
                      <span className="text-[10px] text-neutral-400">Verified Timeline</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {certificate.startDate && (
                        <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                          <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            START DATE
                          </span>
                          <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                            {formatDate(certificate.startDate)}
                          </span>
                        </div>
                      )}

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          COMPLETION DATE
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {formatDate(certificate.completionDate)}
                        </span>
                      </div>

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          ISSUE DATE
                        </span>
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                          {formatDate(certificate.issueDate)}
                        </span>
                      </div>

                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          STATUS
                        </span>
                        <span className="block text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {certificate.grade || 'Successfully Completed'}
                        </span>
                      </div>
                    </div>

                    {/* Remarks */}
                    {certificate.remarks && (
                      <div className="bg-[#f8fafc] dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700/60 mt-2">
                        <span className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          OFFICIAL REMARKS
                        </span>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-1 italic leading-relaxed">
                          "{certificate.remarks}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5">
                    {certificate.allowPublicDownload !== false && (
                      <a
                        href={certificateService.getPdfUrl(certificate.certificateId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Official Certificate PDF</span>
                      </a>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setQrModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5 text-neutral-500" />
                        <span>View QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                        <span>{copied ? 'Copied' : 'Share URL'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Print Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* View 2: Original Certificate Sheet matching Image 1 directly */
              <div className="space-y-4">
                <CertificateSheet
                  certificate={certificate}
                  qrDataUrl={qrData?.qrDataUrl}
                  isRevoked={false}
                />

                <div className="flex justify-center space-x-3 pt-2">
                  <a
                    href={certificateService.getPdfUrl(certificate.certificateId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Printable A4 PDF</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setViewMode('summary')}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Back to Portal Summary
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVOKED STATE */}
        {data?.status === 'revoked' && certificate && (
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-red-300 dark:border-red-900 bg-white dark:bg-neutral-900 animate-in fade-in duration-200">
            {/* Red Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white text-center">
              <div className="flex items-center justify-center space-x-2 text-lg sm:text-xl font-bold tracking-tight">
                <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-sm">
                  ✕
                </div>
                <span>Certificate Revoked</span>
              </div>
              <div className="mt-2.5">
                <span className="inline-block px-3.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                  INVALIDATED BY AUTHORITY
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* ID banner */}
              <div className="rounded-xl p-4 text-center bg-red-950 text-white shadow-inner">
                <span className="block text-[11px] font-medium text-red-300 tracking-wider uppercase">
                  Revoked Certificate ID
                </span>
                <span className="block text-xl sm:text-2xl font-mono font-bold tracking-widest mt-0.5 text-white line-through decoration-red-500">
                  {certificate.certificateId}
                </span>
              </div>

              {/* Warning Notice Box */}
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-4 space-y-2 text-xs text-red-800 dark:text-red-300">
                <div className="flex items-center space-x-2 font-bold text-sm text-red-900 dark:text-red-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Official Compliance Invalidation Notice</span>
                </div>
                <p className="leading-relaxed">
                  This certificate has been formally rescinded by the issuing authority and is invalid for employment, academic credits, or professional credentialing.
                </p>
                <div className="pt-2 border-t border-red-200 dark:border-red-900/50 space-y-1">
                  <div>
                    <span className="font-semibold">Revocation Timestamp: </span>
                    {formatDate(certificate.revokedAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Official Reason: </span>
                    {certificate.revocationReason || 'Invalidated following compliance audit.'}
                  </div>
                </div>
              </div>

              {/* Basic Record */}
              <div className="space-y-2 text-xs">
                <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500 dark:text-neutral-400">Candidate Name: </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {certificate.recipientName}
                  </span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500 dark:text-neutral-400">Issuing Organization: </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {certificate.issuingOrganization}
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Return to Verification Portal
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* NOT FOUND STATE */}
        {data?.status === 'not_found' && (
          <div className="rounded-2xl p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Certificate Not Found
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                No certificate record matching{' '}
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  "{certificateId}"
                </span>{' '}
                exists in our live database.
              </p>
            </div>

            {/* Quick search input */}
            <form onSubmit={handleSearchSubmit} className="max-w-sm mx-auto space-y-2">
              <div className="flex rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-sm">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Try another ID (e.g. DC6E30F05C735E02)"
                  className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 flex items-center justify-center space-x-4">
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Back to Home
              </Link>
              <span>•</span>
              <a href="tel:+919848925128" className="hover:underline">
                Contact HR Desk (+91 9848925128)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrData && certificate && (
        <QrModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          certificateId={certificate.certificateId}
          qrDataUrl={qrData.qrDataUrl}
          verificationUrl={qrData.verificationUrl}
        />
      )}
    </div>
  );
};
