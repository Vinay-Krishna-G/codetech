import React from 'react';
import { CheckCircle2, Award, MapPin, PhoneCall, Mail, Globe, Shield } from 'lucide-react';
import { CodtechLogo } from './CodtechLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <CodtechLogo />
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed mt-2">
              Official Credential Verification and Student Certification Registry for Codtech IT Solutions Private Limited. Providing industry-standard technical training, internship assessments, and corporate background verification services.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ISO 9001:2015 Certified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <Award className="w-3.5 h-3.5 text-amber-600" /> AICTE Affiliated Guidelines
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                MSME Registered (Govt. of India)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                #startupindia Recognized
              </span>
            </div>
          </div>

          {/* Quick Portal Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Portal Directory
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Public Candidate Search
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  HR & Academic Portal Login
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Background Verification (BGV) S.O.P.
                </a>
              </li>
              <li>
                <a
                  href="https://codtechitsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <Globe className="w-3 h-3" />
                  <span>Main Company Website</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Real Office & Campus Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Registered Corporate Office
            </h4>
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
              <p className="font-bold text-neutral-800 dark:text-neutral-200">
                CODTECH IT SOLUTIONS PVT. LTD.
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>8-7-7/2, Plot NO.51, Opp: Naveena School, Hasthinapuram Central, Hyderabad, 500 079, Telangana, India.</span>
              </p>
              <p className="flex items-center gap-1.5 pt-1">
                <PhoneCall className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>+91 9848925128</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href="mailto:hr@codtechitsolutions.com" className="text-blue-600 dark:text-blue-400 underline">
                  hr@codtechitsolutions.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} CODTECH IT SOLUTIONS PRIVATE LIMITED. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accreditation Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
