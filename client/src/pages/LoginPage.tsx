import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CodtechLogo } from '../components/CodtechLogo';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await login(data.email, data.password);
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Invalid administrator credentials. Please check your email or password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'admin@certiverify.com');
    setValue('password', 'Admin@123456');
    setServerError(null);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-950 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <CodtechLogo showText={false} className="w-11 h-11" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white uppercase font-sans">
            HR & Academic Console
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Sign in to issue credentials, manage candidate cohorts, and inspect audit logs.
          </p>
        </div>

        {/* Demo Credentials Quick Pill */}
        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 rounded-xl p-3 text-xs flex items-center justify-between">
          <div className="text-orange-900 dark:text-orange-300">
            <span className="font-bold block">Authorized Signatory Demo Login:</span>
            <span className="text-[11px] text-orange-700 dark:text-orange-400 font-mono">
              admin@certiverify.com / Admin@123456
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
          >
            <KeyRound className="w-3 h-3" />
            <span>Auto Fill</span>
          </button>
        </div>

        {serverError && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                {...register('email')}
                placeholder="admin@certiverify.com"
                className="w-full text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••••••"
                className="w-full text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to HR Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-neutral-500 space-y-1">
          <p>Protected by rate-limiting & HTTP-only secure cookie sessions.</p>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold block">
            ← Return to Public Verification Desk
          </Link>
        </div>
      </div>
    </div>
  );
};
