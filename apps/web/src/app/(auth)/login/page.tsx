'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();

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
      setError('Please enter your campus email or registered email.');
      return;
    }
    if (!trimmedPass) {
      setError('Please enter your account password.');
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
        throw new Error(data?.error || 'Invalid email or password. Please verify your credentials.');
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
      setError(err?.message || 'Failed to authenticate. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
      <div className="text-center space-y-2">
        <div className="relative h-14 w-40 mx-auto">
          <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Portal Sign In
        </h2>
        <p className="text-xs text-slate-500">
          Sign in with your registered email and password to access your portal
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 p-3.5 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Official Campus or Registered Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email address (e.g. yourname@gmail.com)"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Account Password</label>
            <span className="text-xs text-slate-400">
              Required
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
              placeholder="Type your password"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In to Campus Portal'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Secure Credentials Required</span>
        </div>
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Apply / Register Now
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
