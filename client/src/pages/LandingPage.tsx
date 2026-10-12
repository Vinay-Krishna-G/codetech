import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  QrCode,
  FileCheck,
  Ban,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Lock,
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
  Upload,
  Camera,
  ExternalLink,
  Award,
  ChevronDown,
  ChevronUp,
  FileBadge,
} from 'lucide-react';
import { CertificateSheet } from '../components/CertificateSheet';

export const LandingPage: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [activeTab, setActiveTab] = useState<'id' | 'qr'>('id');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    navigate(`/verify/${certId.trim().toUpperCase()}`);
  };

  const handleQuickVerify = (id: string) => {
    navigate(`/verify/${id}`);
  };

  // Demo QR file drag drop simulation
  const handleSimulateQrUpload = (id: string) => {
    navigate(`/verify/${id}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sampleCertData = {
    certificateId: 'CITS24',
    recipientName: 'DOPPALAPUDI SUBHASH',
    recipientEmail: 'subhash.doppalapudi@example.com',
    certificateType: 'Internship Experience' as const,
    achievementTitle: 'Data Analytics',
    domain: 'Data Analytics',
    duration: '6 Weeks',
    issuingOrganization: 'CODTECH IT SOLUTIONS PRIVATE LIMITED',
    startDate: '2026-05-09',
    completionDate: '2026-06-20',
    issueDate: '2026-06-20',
    grade: 'Successfully Completed',
    remarks:
      'Demonstrated strong dedication, technical skills, and a positive learning attitude throughout the internship.',
    signatoryName: 'NEELA SANTHOSH KUMAR',
    signatoryDesignation: 'Human Resources & Academic Head',
    signatoryEmail: 'hr@codtechitsolutions.com',
    status: 'valid' as const,
  };

  const faqs = [
    {
      q: 'How can HR recruiters and Background Verification (BGV) agencies verify an internship certificate?',
      a: 'Recruiters can enter the unique Intern ID or Certificate ID (e.g. CITS24 or DC6E30F05C735E02) located at the top-left or top-right of the certificate. Alternatively, scanning the QR code on the physical or PDF certificate with any smartphone camera will directly open our secure verification page.',
    },
    {
      q: 'What is the difference between an Intern ID and a Certificate ID?',
      a: 'Both identifiers are mapped 1-to-1 in our canonical registry. The Intern ID (e.g. CITS24) corresponds to the student cohort enrollment, while the Certificate ID (e.g. DC6E30F05C735E02) is the cryptographically unique serial generated upon successful completion. Either ID can be queried interchangeably.',
    },
    {
      q: 'What happens if a candidate submits a fabricated or altered certificate?',
      a: 'Any certificate that has not been authorized by Codtech IT Solutions will return a "Certificate Not Found" warning. In addition, credentials that have been invalidated due to disciplinary actions or duplicate submissions will explicitly display a "Certificate Revoked" notice with the timestamp and formal audit reason.',
    },
    {
      q: 'Are internship offer letters also verifiable on this portal?',
      a: 'Yes. Candidates issued genuine offer letters have their corresponding candidate record registered in our academic database. For formal written BGV confirmation, recruiters can also contact our HR verification desk directly at hr@codtechitsolutions.com.',
    },
    {
      q: 'Is this credential recognized by universities and statutory bodies?',
      a: 'Codtech IT Solutions Private Limited is ISO 9001:2015 Certified, recognized under the #startupindia initiative by DPIIT (Govt. of India), and registered with MSME. Our industry internships adhere to AICTE curriculum guidelines.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 font-sans">
      {/* 1. Hero Verification Portal Section */}
      <section className="relative pt-12 pb-16 sm:pb-24 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-semibold border border-orange-200 dark:border-orange-900/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Official Codtech IT Solutions Candidate Verification Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
              Verify Student Internship & Training Credentials
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Authenticate genuine completion certificates, offer letters, and academic credentials issued to students of Codtech IT Solutions Pvt. Ltd. with direct canonical database confirmation.
            </p>
          </div>

          {/* Verification Box with Tabs */}
          <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-4 sm:p-6">
            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4 space-x-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('id')}
                className={`pb-2 transition-colors flex items-center space-x-1.5 border-b-2 -mb-3.5 ${
                  activeTab === 'id'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Verify by Certificate or Intern ID</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`pb-2 transition-colors flex items-center space-x-1.5 border-b-2 -mb-3.5 ${
                  activeTab === 'qr'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Verify by QR Code</span>
              </button>
            </div>

            {/* Tab 1: ID Search */}
            {activeTab === 'id' ? (
              <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="Enter Intern ID or Certificate ID (e.g. DC6E30F05C735E02 or CITS24)"
                      className="w-full text-xs sm:text-sm font-mono uppercase rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 pl-10 pr-3 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-colors shrink-0"
                  >
                    <span>Verify Candidate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Test Links */}
                <div className="pt-2 text-[11px] text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Test Reference Records:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickVerify('DC6E30F05C735E02')}
                    className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-mono hover:bg-blue-100 transition-colors"
                  >
                    DC6E30F05C735E02 (Jagadeesh)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickVerify('CITS24')}
                    className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-mono hover:bg-neutral-200 transition-colors"
                  >
                    CITS24 (Subhash)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickVerify('CITS-REVOKED-01')}
                    className="px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900 font-mono hover:bg-red-100 transition-colors"
                  >
                    CITS-REVOKED-01 (Revoked)
                  </button>
                </div>
              </div>
            ) : (
              /* Tab 2: QR Upload or Camera Scan */
              <div className="py-4 text-center space-y-4">
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 hover:border-blue-500 transition-colors bg-neutral-50 dark:bg-neutral-800/40 cursor-pointer">
                  <QrCode className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Scan or Drag & Drop Certificate QR Code Image
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Upload a screenshot or photo of the top-right QR code from the physical certificate
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateQrUpload('DC6E30F05C735E02')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Test Scan: Jagadeesh QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateQrUpload('CITS24')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Test Scan: Subhash QR</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Key Metrics & Accreditations */}
      <section className="py-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-neutral-100 dark:border-neutral-800 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                14,500+
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                Verified Student Records
              </div>
            </div>

            <div className="p-4 border-r border-neutral-100 dark:border-neutral-800 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                Live Database Backed
              </div>
            </div>

            <div className="p-4 border-r border-neutral-100 dark:border-neutral-800 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                450+
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                Corporate BGV Agencies
              </div>
            </div>

            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                ISO 9001
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-1">
                Quality Management Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Authentic Certificate Showcase (Matching Image 1) */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Standard Format Inspection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Official Certificate Anatomy & Security Features
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Every authentic certificate issued by Codtech IT Solutions Pvt. Ltd. includes tamper-proof elements, registered company seals, authorized signatures, and verifiable QR codes.
            </p>
          </div>

          {/* Interactive Document Sheet View */}
          <div className="max-w-2xl mx-auto">
            <CertificateSheet certificate={sampleCertData} />
            <div className="text-center mt-4">
              <Link
                to="/verify/CITS24"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View Full Verification Dossier for CITS24 (Subhash)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified Domains & Programs */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Verified Technical Internship Domains
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Credentials are issued following rigorous practical project milestones and technical evaluations under industry mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Data Science & Analytics
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                Data Analytics & Business Intelligence
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Covers Python, SQL, Power BI, Advanced Tableau, Exploratory Data Analysis, and Statistical Modeling with end-to-end data pipelines.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-neutral-500">
                Duration: 6 to 8 Weeks | Capstone Assessment Required
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Full-Stack Engineering
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                MERN Full Stack Web Development
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Architecture of modern React.js client frontends, Express/Node RESTful APIs, MongoDB database modeling, and authentication systems.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-neutral-500">
                Duration: 8 to 12 Weeks | Code Review Verified
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Cloud & Infrastructure
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                Cloud Architecture & DevOps
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Distributed services on AWS and Azure, Docker containerization, CI/CD pipeline automation, and microservices architecture.
              </p>
              <div className="mt-4 text-[11px] font-semibold text-neutral-500">
                Duration: 8 Weeks | Deployment Verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Instructions for HR & BGV Agencies */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <FileBadge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Guidelines for Employers & BGV Agencies</h3>
                <p className="text-xs text-neutral-500">
                  Standard Operating Procedure for verifying Codtech IT Solutions credentials
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="block text-neutral-900 dark:text-white text-sm">
                    Direct ID Verification
                  </strong>
                  Enter the candidate's Intern ID or Certificate ID into the search field above. A valid response confirms candidate name, completion dates, domain, and authorized signatory.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="block text-neutral-900 dark:text-white text-sm">
                    Cross-Reference Printed Signatures & Seals
                  </strong>
                  Compare the submitted certificate against our canonical database record. Authentic certificates bear the signature of <strong>Neela Santhosh Kumar (HR & Academic Head)</strong> and corporate seals.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="block text-neutral-900 dark:text-white text-sm">
                    Formal BGV Written Confirmation
                  </strong>
                  For formal background verification forms requiring institutional email verification, email your query with the candidate's resume and Intern ID to{' '}
                  <a
                    href="mailto:hr@codtechitsolutions.com"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline"
                  >
                    hr@codtechitsolutions.com
                  </a>
                  . Turnaround time is typically within 24 to 48 business hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Recruiter FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-800/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200/50 dark:border-neutral-700/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Corporate Contact & Helpdesk Banner */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Registered Corporate Campus</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                8-7-7/2, Plot NO.51, Opp: Naveena School, Hasthinapuram Central, Hyderabad, 500 079, Telangana, India.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>Verification Helpdesk</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                General Inquiries: hr@codtechitsolutions.com<br />
                Academic Records: support@codtechlearning.com
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
                <PhoneCall className="w-4 h-4" />
                <span>Direct Telephone Support</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                HR Hotline: +91 9848925128<br />
                Hours: Monday – Saturday, 9:30 AM – 6:30 PM IST
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
