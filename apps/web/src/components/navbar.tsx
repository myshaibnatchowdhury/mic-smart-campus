'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  LogIn, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X 
} from 'lucide-react';
import { useApp } from '@/context/app-context';

export function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b transition-colors duration-200 border-slate-200 bg-white/95 text-slate-800 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-32 rounded-lg p-1 transition-all">
            <Image 
              src="/logo.png" 
              alt="MIC Smart Campus" 
              fill
              className="object-contain dark:brightness-110"
              priority
            />
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/#features" className="transition hover:text-emerald-700 dark:hover:text-emerald-400">
            {t('nav_features')}
          </Link>
          <Link href="/#institutions" className="transition hover:text-emerald-700 dark:hover:text-emerald-400">
            {t('nav_institutions')}
          </Link>
          <Link href="/about" className="transition hover:text-emerald-700 dark:hover:text-emerald-400">
            {t('nav_about')}
          </Link>
          <Link href="/contact" className="transition hover:text-emerald-700 dark:hover:text-emerald-400">
            {t('nav_contact')}
          </Link>
        </nav>

        {/* CONTROLS & AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          
          {/* THEME TOGGLE: 2 OPTIONS (DAY / DARK) */}
          <div 
            role="group" 
            aria-label="Theme Switcher" 
            className="flex items-center rounded-xl border border-slate-300 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setTheme('light')}
              title={language === 'bn' ? 'লাইট (ডে) মোড' : 'Day Mode'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                theme === 'light'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sun className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{language === 'bn' ? 'ডে' : 'Day'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              title={language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                theme === 'dark'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
            </button>
          </div>

          {/* LANGUAGE SWITCHER: 2 OPTIONS (BANGLA / ENGLISH) */}
          <div 
            role="group" 
            aria-label="Language Switcher" 
            className="flex items-center rounded-xl border border-slate-300 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              title="বাংলা ভাষা"
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                language === 'bn'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              title="English Language"
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* PORTAL LOGIN BUTTON */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
          >
            <LogIn className="h-3.5 w-3.5" />
            {t('nav_login')}
          </Link>

          {/* ADMISSION / REGISTER BUTTON */}
          <Link
            href="/register"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-800 hover:scale-[1.02] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
            {t('nav_register')}
          </Link>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex lg:hidden items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link 
              href="/#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {t('nav_features')}
            </Link>
            <Link 
              href="/#institutions" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {t('nav_institutions')}
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {t('nav_about')}
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {t('nav_contact')}
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2 text-sm font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <LogIn className="h-4 w-4" />
              {t('nav_login')}
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2 text-sm font-bold text-white shadow dark:bg-emerald-600"
            >
              <GraduationCap className="h-4 w-4 text-amber-300" />
              {t('nav_register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
