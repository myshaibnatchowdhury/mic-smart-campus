'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/app-context';

function LoginForm() {
  const router = useRouter();
  const { t, language, theme } = useApp();

  // Mode: 'login' | 'forgot_step1' | 'forgot_step2'
  const [viewMode, setViewMode] = useState<'login' | 'forgot_step1' | 'forgot_step2'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Standard Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail) {
      setError(t('login_err_empty_email'));
      return;
    }
    if (!trimmedPass) {
      setError(t('login_err_empty_pass'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || (language === 'bn' ? 'ভুল ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় যাচাই করুন।' : 'Invalid email or password. Please verify your credentials.'));
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mic_logged_in_email', trimmedEmail);
      }

      // Route according to verified role
      switch (data.role) {
        case 'super_admin':
          router.push('/super-admin');
          break;
        case 'institution_admin':
        case 'institution_owner':
        case 'principal':
          router.push('/tenant-admin');
          break;
        case 'teacher':
          router.push('/teacher');
          break;
        case 'parent':
          router.push('/parent');
          break;
        case 'student':
        default:
          router.push('/student');
          break;
      }
    } catch (err: any) {
      setError(err?.message || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড যাচাই করুন।' : 'Failed to authenticate. Check your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 1: Send 6-Digit Code to Gmail
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError(t('login_err_empty_email'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to dispatch reset code.');
      }

      setSuccessMsg(data.message || (language === 'bn' ? 'আপনার জিমেইলে ৬ ডিজিটের কোড পাঠানো হয়েছে!' : 'Verification code sent to your Gmail!'));
      setViewMode('forgot_step2');
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify Code and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const cleanCode = otpCode.trim();
    const cleanPass = newPassword.trim();

    if (!cleanCode) {
      setError(language === 'bn' ? '৬ ডিজিটের ভেরিফিকেশন কোড লিখুন' : 'Please enter the 6-digit verification code');
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setError(language === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'New password must be at least 6 characters long');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setError(language === 'bn' ? 'দুইটি পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          newPassword: cleanPass
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to reset password.');
      }

      setSuccessMsg(t('forgot_success'));
      setEmail(cleanEmail);
      setPassword(cleanPass);
      setViewMode('login');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-6 p-8 rounded-3xl border shadow-xl transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-slate-900 border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* HEADER LOGO */}
      <div className="text-center space-y-2">
        <div className="relative h-14 w-40 mx-auto">
          <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
        </div>

        {viewMode === 'login' && (
          <>
            <h2 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t('login_title')}
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('login_subtitle')}
            </p>
          </>
        )}

        {viewMode === 'forgot_step1' && (
          <>
            <h2 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t('forgot_title')}
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('forgot_sub')}
            </p>
          </>
        )}

        {viewMode === 'forgot_step2' && (
          <>
            <h2 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t('forgot_step2_title')}
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('forgot_step2_sub')}
            </p>
          </>
        )}
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-2xl bg-rose-500/10 p-3.5 border border-rose-500/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/30 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* VIEW 1: REGULAR LOGIN FORM */}
      {viewMode === 'login' && (
        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {t('login_email_label')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login_email_placeholder')}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('login_pass_label')}
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email || 'myshaibnatchowdhury@gmail.com');
                  setError(null);
                  setSuccessMsg(null);
                  setViewMode('forgot_step1');
                }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('login_forgot_pass')}
              </button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login_pass_placeholder')}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t('login_authenticating') : t('login_btn')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* VIEW 2: FORGOT PASSWORD STEP 1 (ENTER EMAIL) */}
      {viewMode === 'forgot_step1' && (
        <form onSubmit={handleSendResetCode} autoComplete="off" className="space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {t('login_email_label')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="off"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="myshaibnatchowdhury@gmail.com"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              {language === 'bn' 
                ? 'এই জিমেইলে তাৎক্ষণিকভাবে একটি ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হবে।' 
                : 'A 6-digit verification code will be dispatched to this Gmail address immediately.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t('forgot_sending') : t('forgot_send_btn')}
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => { setViewMode('login'); setError(null); }}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              ← {t('forgot_back_to_login')}
            </button>
          </div>
        </form>
      )}

      {/* VIEW 3: FORGOT PASSWORD STEP 2 (ENTER CODE & NEW PASSWORD) */}
      {viewMode === 'forgot_step2' && (
        <form onSubmit={handleResetPassword} autoComplete="off" className="space-y-4">
          <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>{forgotEmail}</strong>
          </div>

          <div className="space-y-1">
            <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {t('forgot_code_label')}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder={t('forgot_code_placeholder')}
              className={`w-full rounded-xl border py-2.5 px-4 text-center tracking-widest text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-500'
                  : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {t('forgot_new_pass_label')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {t('forgot_confirm_pass_label')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t('forgot_resetting') : t('forgot_reset_btn')}
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => { setViewMode('forgot_step1'); setError(null); }}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              ← {language === 'bn' ? 'কোড পরিবর্তন বা পুনরায় পাঠান' : 'Change email or resend code'}
            </button>
          </div>
        </form>
      )}

      {/* FOOTER ACTION */}
      <div className={`pt-4 border-t flex items-center justify-between text-xs ${
        theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
      }`}>
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>{t('login_secure')}</span>
        </div>
        <Link 
          href="/register" 
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {t('login_apply_link')}
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { theme } = useApp();

  return (
    <div className={`min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      <Suspense fallback={<div className="text-xs text-slate-500">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
