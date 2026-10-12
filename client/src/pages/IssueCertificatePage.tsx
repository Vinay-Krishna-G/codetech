import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PlusCircle,
  FileCheck,
  Calendar,
  User,
  Award,
  Sparkles,
  Download,
  Share2,
  Check,
  AlertCircle,
  ExternalLink,
  Wand2,
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import type { Certificate } from '../types';
import { CertificateSheet } from '../components/CertificateSheet';

const issueFormSchema = z
  .object({
    certificateId: z
      .string()
      .trim()
      .toUpperCase()
      .max(30, 'Certificate ID cannot exceed 30 characters')
      .optional(),
    recipientName: z
      .string()
      .trim()
      .min(2, 'Recipient full name must be at least 2 characters')
      .max(120),
    recipientEmail: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),
    certificateType: z.enum([
      'Internship Experience',
      'Project Completion',
      'Training Completion',
      'Workshop Participation',
      'Assessment Achievement',
      'Course Completion',
    ]),
    achievementTitle: z
      .string()
      .trim()
      .min(2, 'Achievement or project title is required'),
    domain: z.string().trim().optional(),
    duration: z.string().trim().optional(),
    description: z.string().trim().optional(),
    remarks: z.string().trim().optional(),
    issuingOrganization: z.string().trim().min(2, 'Issuing organization is required'),
    startDate: z.string().optional().or(z.literal('')),
    completionDate: z.string().min(1, 'Completion date is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    grade: z.string().trim().optional(),
    signatoryName: z.string().trim().optional(),
    signatoryDesignation: z.string().trim().optional(),
    signatoryEmail: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      const comp = new Date(data.completionDate);
      const iss = new Date(data.issueDate);
      if (isNaN(comp.getTime()) || isNaN(iss.getTime())) return false;
      return comp.getTime() <= iss.getTime() + 86400000;
    },
    {
      message: 'Completion date cannot be after the issue date',
      path: ['completionDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate) return true;
      const st = new Date(data.startDate);
      const comp = new Date(data.completionDate);
      if (isNaN(st.getTime()) || isNaN(comp.getTime())) return false;
      return st.getTime() <= comp.getTime();
    },
    {
      message: 'Start date cannot be after completion date',
      path: ['startDate'],
    }
  );

type IssueFormData = z.infer<typeof issueFormSchema>;

export const IssueCertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<IssueFormData | null>(null);

  // Success modal state
  const [createdCertificate, setCreatedCertificate] = useState<Certificate | null>(null);
  const [createdQr, setCreatedQr] = useState<{ qrDataUrl: string; verificationUrl: string } | null>(
    null
  );
  const [linkCopied, setLinkCopied] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      certificateId: '',
      recipientName: '',
      recipientEmail: '',
      certificateType: 'Internship Experience',
      achievementTitle: 'Data Analytics',
      domain: 'Data Analytics',
      duration: '6 Weeks',
      description:
        'We appreciate his/her active participation, consistent efforts, and impressive contribution to the overall success of the internship. We wish him/her all the best in future endeavors. We are confident that his/her dedication and skills will lead to great achievements ahead.',
      remarks:
        'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.',
      issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
      startDate: '2026-06-18',
      completionDate: '2026-07-30',
      issueDate: todayStr,
      grade: 'Successfully Completed',
      signatoryName: 'NEELA SANTHOSH KUMAR',
      signatoryDesignation: 'Human Resources & Academic Head',
      signatoryEmail: 'hr@codtechitsolutions.com',
    },
  });

  const formValues = watch();

  // Template pre-fill helper
  const applyTemplate = (type: string) => {
    if (type === 'data_analytics') {
      setValue('certificateType', 'Internship Experience');
      setValue('achievementTitle', 'Data Analytics');
      setValue('domain', 'Data Analytics');
      setValue('duration', '6 Weeks');
      setValue(
        'remarks',
        'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.'
      );
    } else if (type === 'web_dev') {
      setValue('certificateType', 'Internship Experience');
      setValue('achievementTitle', 'Full-Stack Web Development');
      setValue('domain', 'Full Stack Engineering');
      setValue('duration', '8 Weeks');
      setValue(
        'remarks',
        'Demonstrated strong problem-solving skills, active teamwork, and clean software architecture in the capstone portal.'
      );
    } else if (type === 'cloud') {
      setValue('certificateType', 'Project Completion');
      setValue('achievementTitle', 'Distributed Cloud Architecture');
      setValue('domain', 'Cloud Computing');
      setValue('duration', '8 Weeks');
      setValue(
        'remarks',
        'Successfully completed cloud infrastructure automation and deployment assessment with high proficiency.'
      );
    }
  };

  const handlePreSubmit = (data: IssueFormData) => {
    setPendingData(data);
    setShowConfirmModal(true);
    setServerError(null);
  };

  const handleFinalSubmit = async () => {
    if (!pendingData) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await certificateService.createCertificate(pendingData);
      setCreatedCertificate(res.certificate);
      setShowConfirmModal(false);

      try {
        const qr = await certificateService.getQrData(res.certificate.certificateId);
        setCreatedQr(qr);
      } catch {
        // non-fatal
      }
    } catch (err: any) {
      setShowConfirmModal(false);
      setServerError(
        err.response?.data?.message || 'Failed to issue certificate. Please verify input fields.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Issue Official Certificate
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Authorize and record a student completion credential in the official Codtech registry
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          ← Return to HR Console
        </button>
      </div>

      {serverError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-4 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Quick 1-Click HR Presets Bar */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 dark:text-blue-300">
          <Wand2 className="w-4 h-4 text-blue-600" />
          <span>Quick Program Templates:</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => applyTemplate('data_analytics')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            Data Analytics (6 Weeks)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('web_dev')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            Full-Stack Web Dev (8 Weeks)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('cloud')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            Cloud Architecture (8 Weeks)
          </button>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Real Certificate Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">
            {/* Section 1: Candidate Particulars */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>1. Candidate Particulars</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Intern / Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('recipientName')}
                    placeholder="E.g., DOPPALAPUDI SUBHASH"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                  />
                  {errors.recipientName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.recipientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Recipient Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    {...register('recipientEmail')}
                    placeholder="candidate@example.com"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.recipientEmail && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.recipientEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Intern ID / Certificate ID (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('certificateId')}
                    placeholder="E.g. CITS25 (auto-generated if empty)"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Program & Domain Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>2. Program & Domain Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Certificate Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('certificateType')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Internship Experience">Internship Experience</option>
                    <option value="Project Completion">Project Completion</option>
                    <option value="Training Completion">Training Completion</option>
                    <option value="Workshop Participation">Workshop Participation</option>
                    <option value="Assessment Achievement">Assessment Achievement</option>
                    <option value="Course Completion">Course Completion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Program / Domain Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('achievementTitle')}
                    placeholder="E.g., Data Analytics"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  {errors.achievementTitle && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.achievementTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Domain / Field Specialization
                  </label>
                  <input
                    type="text"
                    {...register('domain')}
                    placeholder="E.g., Data Analytics"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    {...register('duration')}
                    placeholder="E.g., 6 Weeks"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Performance Result / Status
                  </label>
                  <input
                    type="text"
                    {...register('grade')}
                    placeholder="E.g., Successfully Completed"
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    {...register('issuingOrganization')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Official Remarks / Feedback
                  </label>
                  <input
                    type="text"
                    {...register('remarks')}
                    placeholder="E.g., Demonstrated strong dedication, technical skills, and a positive learning attitude."
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Timeline & Dates */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>3. Timeline & Issue Date</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.startDate && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('completionDate')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.completionDate && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.completionDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('issueDate')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.issueDate && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.issueDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Authorized Signatory */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>4. Authorized Signatory Profile</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    {...register('signatoryName')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    {...register('signatoryDesignation')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    {...register('signatoryEmail')}
                    className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-neutral-900 dark:text-white text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Review & Authorize Issuance</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (Right) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-Time Certificate Preview</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              Matches Image 1
            </span>
          </div>

          {/* Authentic Document Sheet Preview */}
          <div className="scale-95 origin-top">
            <CertificateSheet certificate={formValues} />
          </div>
        </div>
      </div>

      {/* Confirmation Step Modal */}
      {showConfirmModal && pendingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Authorize Certificate Issuance
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Please verify that all candidate records and dates are accurate. This action generates a canonical record in the verification registry.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
              <div>
                <strong>Candidate:</strong> {pendingData.recipientName}
              </div>
              <div>
                <strong>Domain:</strong> {pendingData.achievementTitle} ({pendingData.duration})
              </div>
              <div>
                <strong>Internship Period:</strong> {pendingData.startDate || 'N/A'} to{' '}
                {pendingData.completionDate}
              </div>
              <div>
                <strong>Status:</strong> {pendingData.grade}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
              >
                Make Changes
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2"
              >
                {submitting ? (
                  <span>Recording in Database...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Issue Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Issuance Success Modal */}
      {createdCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl relative space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Certificate Recorded Successfully!
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Unique Certificate ID:{' '}
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  {createdCertificate.certificateId}
                </span>
              </p>
            </div>

            {/* QR Code Graphic */}
            {createdQr && (
              <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-inner inline-block mx-auto">
                <img
                  src={createdQr.qrDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto"
                />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={certificateService.getPdfUrl(createdCertificate.certificateId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Certificate PDF</span>
              </a>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyLink(
                      `${window.location.origin}/verify/${createdCertificate.certificateId}`
                    )
                  }
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  {linkCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span>{linkCopied ? 'Link Copied' : 'Copy Verification URL'}</span>
                </button>

                <a
                  href={`/verify/${createdCertificate.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Public Page</span>
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              >
                Return to HR Console Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
