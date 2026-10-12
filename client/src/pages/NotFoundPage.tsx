import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          The requested page does not exist or has been relocated within the registry.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
