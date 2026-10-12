import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Ban,
  LogIn,
  LogOut,
  FileText,
  Eye,
} from 'lucide-react';
import { certificateService } from '../services/certificateService';
import type { AuditLog } from '../types';
import { TableSkeleton } from '../components/SkeletonLoader';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [certSearch, setCertSearch] = useState('');

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const data = await certificateService.getAuditLogs({
        page,
        limit: 15,
        action: actionFilter !== 'all' ? actionFilter : undefined,
        certificateId: certSearch.trim() || undefined,
      });
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [actionFilter, certSearch]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ISSUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3 h-3" /> ISSUE
          </span>
        );
      case 'REVOKE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800">
            <Ban className="w-3 h-3" /> REVOKE
          </span>
        );
      case 'LOGIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <LogIn className="w-3 h-3" /> LOGIN
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <LogOut className="w-3 h-3" /> LOGOUT
          </span>
        );
      case 'VIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Eye className="w-3 h-3" /> VERIFY VIEW
          </span>
        );
      case 'EXPORT_PDF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <FileText className="w-3 h-3" /> PDF EXPORT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-800">
            {action}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Immutable Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Permanent, append-only security logs for certificate issuance, revocations, and verifications
          </p>
        </div>

        <Link
          to="/admin"
          className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Audit Log Table Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={certSearch}
              onChange={(e) => setCertSearch(e.target.value)}
              placeholder="Search by Certificate ID..."
              className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 pl-9 pr-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-2.5 py-1.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Action Types</option>
              <option value="ISSUE">ISSUE</option>
              <option value="REVOKE">REVOKE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="VIEW">VIEW (Verification)</option>
              <option value="EXPORT_PDF">EXPORT_PDF</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={8} />
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              No audit records match the current filter criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                      {log.certificateId ? (
                        <Link
                          to={`/verify/${log.certificateId}`}
                          className="hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {log.certificateId}
                        </Link>
                      ) : (
                        <span className="text-neutral-400 font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                      {log.actorEmail || log.actorId?.email || 'system'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
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
              {logs.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {pagination.total}
            </span>{' '}
            audit records
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
