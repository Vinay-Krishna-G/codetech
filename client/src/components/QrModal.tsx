import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  qrDataUrl: string;
  verificationUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  certificateId,
  qrDataUrl,
  verificationUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          Verification QR Code
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Certificate ID: <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">{certificateId}</span>
        </p>

        {/* QR Code Graphic */}
        <div className="my-5 p-4 bg-white rounded-xl border border-neutral-200 shadow-inner inline-block">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${certificateId}`}
              className="w-48 h-48 mx-auto"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-neutral-400 text-xs">
              Loading QR...
            </div>
          )}
        </div>

        {/* URL Box */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 mb-4 text-left flex items-center justify-between">
          <div className="truncate text-xs font-mono text-neutral-600 dark:text-neutral-300 pr-2">
            {verificationUrl}
          </div>
          <button
            onClick={handleCopy}
            title="Copy verification URL"
            className="shrink-0 p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Page</span>
          </a>
        </div>
      </div>
    </div>
  );
};
