'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/app-context';

function LoginForm() {
  const router = useRouter();
  const { t, language, theme } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

  return (
    <div className={`max-w-md w-full space-y-6 p-8 rounded-3xl border shadow-xl transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-slate-900 border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="text-center space-y-2">
        <div className="relative h-14 w-40 mx-auto">
          <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
        </div>
        <h2 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t('login_title')}
        </h2>
        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('login_subtitle')}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 p-3.5 border border-rose-500/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

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
            <span className="text-xs text-slate-400">
              {language === 'bn' ? 'আবশ্যক' : 'Required'}
            </span>
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
