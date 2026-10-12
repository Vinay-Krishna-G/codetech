import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { certificateService } from '../services/certificateService';

interface RevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  recipientName: string;
  onRevoked: () => void;
}

export const RevokeModal: React.FC<RevokeModalProps> = ({
  isOpen,
  onClose,
  certificateId,
  recipientName,
  onRevoked,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) {
      setError('A comprehensive revocation reason (minimum 5 characters) is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await certificateService.revokeCertificate(certificateId, reason.trim());
      onRevoked();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to revoke certificate. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Revoke Certificate
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Irreversible Compliance Action
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 mb-4 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            You are about to revoke certificate <strong>{certificateId}</strong> issued to{' '}
            <strong>{recipientName}</strong>. This status will immediately appear on all public verification lookups.
          </span>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Reason for Revocation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., Credential issued in error / Disciplinary review / Duplicate record"
              rows={3}
              className="w-full text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              This reason will be recorded in the permanent audit trail.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 5}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
            >
              {loading ? (
                <span>Revoking...</span>
              ) : (
                <span>Confirm Revocation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
