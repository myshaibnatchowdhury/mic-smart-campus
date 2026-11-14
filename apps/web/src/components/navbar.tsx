'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, LayoutDashboard, Shield, LogIn } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-32">
            <Image 
              src="/logo.png" 
              alt="MIC Smart Campus" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/#features" className="transition hover:text-emerald-700">Features</Link>
          <Link href="/#institutions" className="transition hover:text-emerald-700">Institutions</Link>
          <Link href="/about" className="transition hover:text-emerald-700">About Platform</Link>
          <Link href="/contact" className="transition hover:text-emerald-700">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700"
          >
            <LogIn className="h-4 w-4" />
            Portal Login
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-900"
          >
            <GraduationCap className="h-4 w-4 text-amber-400" />
            Admission / Register
          </Link>
        </div>
      </div>
    </header>
  );
}
