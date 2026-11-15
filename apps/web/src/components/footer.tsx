'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Shield, Heart } from 'lucide-react';
import { useApp } from '@/context/app-context';

export function Footer() {
  const { t, language } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 transition-colors duration-200 dark:border-slate-800 dark:bg-black dark:text-slate-400">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4">
            <div className="relative h-12 w-36 brightness-0 invert opacity-95">
              <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>{t('hero_title_1')}</span> • <span>{t('hero_title_2')}</span> • <span>{t('hero_title_3')}</span>
            </div>
          </div>

          {/* PLATFORM MODULES */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer_modules')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-emerald-400">{t('feat_3_title')}</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">{t('feat_2_title')}</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">{t('feat_4_title')}</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">{t('feat_5_title')}</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">{t('feat_1_title')}</Link></li>
            </ul>
          </div>

          {/* INSTITUTIONAL PORTALS */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer_portals')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-emerald-400">{t('role_super_admin')}</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">{t('role_tenant_admin')}</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">{t('role_teacher')}</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">{t('role_student')}</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">{t('role_parent')}</Link></li>
            </ul>
          </div>

          {/* CONTACT & SECURITY */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer_contact')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{t('footer_location')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>support@mic-campus.edu.bd</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{t('footer_rls_enforced')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('brand')}. {t('footer_rights')}</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">{t('footer_privacy')}</Link>
            <Link href="/terms" className="hover:text-slate-300">{t('footer_terms')}</Link>
            <Link href="/#features" className="hover:text-slate-300">{t('footer_security')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
