import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertOctagon,
  PlusCircle,
  Search,
  Filter,
  Download,
  QrCode,
  ExternalLink,
  Ban,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import type { Certificate, DashboardStats } from '../types';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import { RevokeModal } from '../components/RevokeModal';
import { QrModal } from '../components/QrModal';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals state
  const [revokeTarget, setRevokeTarget] = useState<Certificate | null>(null);
  const [qrTarget, setQrTarget] = useState<{ id: string; qrUrl: string; verifyUrl: string } | null>(
    null
  );

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await certificateService.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchCertificates = async (page = 1) => {
    setLoadingTable(true);
    try {
      const data = await certificateService.getCertificates({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter,
        type: typeFilter,
      });
      setCertificates(data.certificates);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCertificates(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter]);

  const handleOpenQr = async (cert: Certificate) => {
    try {
      const data = await certificateService.getQrData(cert.certificateId);
      setQrTarget({
        id: cert.certificateId,
        qrUrl: data.qrDataUrl,
        verifyUrl: data.verificationUrl,
      });
    } catch (err) {
      console.error('Failed to get QR data:', err);
    }
  };

  const handleRevokeSuccess = () => {
    fetchStats();
    fetchCertificates(pagination.page);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Issuance Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white font-sans">
              HR & Academic Registry Console
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
              CODTECH IT SOLUTIONS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Central repository for candidate enrollment, certificate issuance, and compliance verification
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              fetchStats();
              fetchCertificates(pagination.page);
            }}
            className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            title="Refresh Registry Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to="/admin/issue"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Certificate</span>
          </Link>
        </div>
      </div>

      {/* Database Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Stat 1 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Total Issued
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {stats?.totalIssued ?? 0}
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Permanent records in database
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Active Valid
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stats?.activeCertificates ?? 0}
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Publicly verifiable
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Revoked
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">
                  {stats?.revokedCertificates ?? 0}
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Invalidated by authority
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Program Types
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {stats?.byType?.length ?? 0}
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5 truncate">
                  {stats?.byType?.[0]
                    ? `Top: ${stats.byType[0].type}`
                    : 'Internships & Projects'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Certificates Management Table Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar / Search & Filter */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, recipient, title..."
              className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 pl-9 pr-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-2.5 py-1.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="valid">Valid Only</option>
              <option value="revoked">Revoked Only</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-2.5 py-1.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[140px] truncate"
            >
              <option value="all">All Types</option>
              <option value="Internship Experience">Internship</option>
              <option value="Project Completion">Project</option>
              <option value="Training Completion">Training</option>
              <option value="Workshop Participation">Workshop</option>
              <option value="Assessment Achievement">Assessment</option>
              <option value="Course Completion">Course</option>
            </select>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="overflow-x-auto">
          {loadingTable ? (
            <div className="p-6">
              <TableSkeleton rows={6} />
            </div>
          ) : certificates.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                No certificates found
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No matching records found. Try modifying your search query or filters.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Program / Domain</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {certificates.map((cert) => (
                  <tr
                    key={cert._id || cert.certificateId}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    {/* Certificate ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                      {cert.certificateId}
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {cert.recipientName}
                      </div>
                      {cert.recipientEmail && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-[160px]">
                          {cert.recipientEmail}
                        </div>
                      )}
                    </td>

                    {/* Achievement Title & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-800 dark:text-neutral-200">
                        {cert.achievementTitle}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {cert.certificateType}
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {formatDate(cert.issueDate)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {cert.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800">
                          <AlertOctagon className="w-3 h-3" />
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Public Verify Link */}
                        <Link
                          to={`/verify/${cert.certificateId}`}
                          target="_blank"
                          title="View Public Verification Page"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* PDF Download */}
                        <a
                          href={certificateService.getPdfUrl(cert.certificateId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download Canonical PDF"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {/* QR Code Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => handleOpenQr(cert)}
                          title="Show Verification QR Code"
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Revoke Action */}
                        {cert.status === 'valid' && (
                          <button
                            type="button"
                            onClick={() => setRevokeTarget(cert)}
                            title="Revoke Certificate"
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div>
            Showing{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {certificates.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {pagination.total}
            </span>{' '}
            certificates
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchCertificates(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchCertificates(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Revoke Modal */}
      {revokeTarget && (
        <RevokeModal
          isOpen={!!revokeTarget}
          onClose={() => setRevokeTarget(null)}
          certificateId={revokeTarget.certificateId}
          recipientName={revokeTarget.recipientName}
          onRevoked={handleRevokeSuccess}
        />
      )}

      {/* QR Modal */}
      {qrTarget && (
        <QrModal
          isOpen={!!qrTarget}
          onClose={() => setQrTarget(null)}
          certificateId={qrTarget.id}
          qrDataUrl={qrTarget.qrUrl}
          verificationUrl={qrTarget.verifyUrl}
        />
      )}
    </div>
  );
};
