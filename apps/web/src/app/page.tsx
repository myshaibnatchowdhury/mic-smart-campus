'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Calendar, 
  Award, 
  CreditCard, 
  BookOpen, 
  Bus, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Building2, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Sliders
} from 'lucide-react';
import { DEMO_INSTITUTIONS } from '@/lib/mock-data';
import { useApp } from '@/context/app-context';

export default function HomePage() {
  const { theme, language, t } = useApp();

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-200">
      
      {/* HERO SECTION: ADAPTS TO FULL DAY & FULL DARK */}
      <section className={`relative overflow-hidden py-20 lg:py-32 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white'
          : 'bg-gradient-to-b from-emerald-100/70 via-teal-50/40 to-slate-50 text-slate-900 border-b border-emerald-100'
      }`}>
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]'
        }`} />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO TEXT COLUMN */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                theme === 'dark'
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border border-emerald-300 bg-emerald-100/90 text-emerald-900 shadow-sm'
              }`}>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                {t('hero_badge')}
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight transition ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {t('hero_title_1')} <span className="text-emerald-500">•</span> {t('hero_title_2')} <span className="text-emerald-500">•</span>{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                  {t('hero_title_3')}
                </span>
              </h1>
              
              <p className={`text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed transition ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700 font-medium'
              }`}>
                {t('hero_subtitle')}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-600 hover:scale-[1.02] dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  {t('hero_cta_portal')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                      : 'border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:text-emerald-800'
                  }`}
                >
                  <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {t('hero_cta_onboard')}
                </Link>
              </div>

              {/* STATS ROW */}
              <div className={`pt-6 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 border-t ${
                theme === 'dark' ? 'border-slate-800/80' : 'border-slate-300/80'
              }`}>
                <div>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t('stat_rls_num')}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('stat_rls_text')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {t('stat_sdui_num')}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('stat_sdui_text')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {t('stat_bdt_num')}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('stat_bdt_text')}
                  </div>
                </div>
              </div>
            </div>

            {/* HERO PREVIEW CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl backdrop-blur-xl border transition ${
                theme === 'dark'
                  ? 'border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/95 text-white'
                  : 'border-slate-200 bg-white text-slate-900 shadow-slate-200'
              }`}>
                <div className={`flex items-center justify-between pb-4 border-b ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div className="relative h-12 w-32">
                    <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 ${
                    theme === 'dark'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t('card_live')}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className={`rounded-2xl p-4 border flex items-center justify-between ${
                    theme === 'dark'
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('card_active_tenant')}
                      </div>
                      <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {language === 'bn' ? 'এমআইসি স্মার্ট ইউনিভার্সিটি' : 'MIC Smart University'}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {t('card_tier')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-2xl border p-3.5 ${
                      theme === 'dark'
                        ? 'bg-emerald-950/40 border-emerald-900/50 text-white'
                        : 'bg-emerald-50 border-emerald-200 text-slate-900'
                    }`}>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                        {t('card_attendance')}
                      </div>
                      <div className="text-xl font-extrabold mt-1">
                        {language === 'bn' ? '৯৪.৮%' : '94.8%'}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-300">
                        {t('card_attendance_sub')}
                      </div>
                    </div>
                    
                    <div className={`rounded-2xl border p-3.5 ${
                      theme === 'dark'
                        ? 'bg-amber-950/30 border-amber-900/40 text-white'
                        : 'bg-amber-50 border-amber-200 text-slate-900'
                    }`}>
                      <div className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                        {t('card_invoices')}
                      </div>
                      <div className="text-xl font-extrabold mt-1">
                        {language === 'bn' ? '৳ ১২,৪৫০' : '৳ 12,450'}
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-300">
                        {t('card_invoices_sub')}
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-4 space-y-2 ${
                    theme === 'dark'
                      ? 'bg-slate-950/70 border-slate-800/80'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span>{t('card_sdui_title')}</span>
                      <Sliders className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {t('card_sdui_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROLE PORTALS SHOWCASE */}
      <section className={`py-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('portals_title')}
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              {t('portals_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                role: t('role_super_admin'),
                desc: t('role_super_admin_desc'),
                color: theme === 'dark' 
                  ? 'border-purple-900/60 bg-purple-950/20 text-purple-200' 
                  : 'border-purple-200 bg-purple-50/70 text-purple-950',
                btnColor: 'bg-purple-700 hover:bg-purple-800 text-white',
                link: '/login?role=super_admin'
              },
              {
                role: t('role_tenant_admin'),
                desc: t('role_tenant_admin_desc'),
                color: theme === 'dark' 
                  ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-200' 
                  : 'border-emerald-200 bg-emerald-50/70 text-emerald-950',
                btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
                link: '/login?role=institution_admin'
              },
              {
                role: t('role_teacher'),
                desc: t('role_teacher_desc'),
                color: theme === 'dark' 
                  ? 'border-blue-900/60 bg-blue-950/20 text-blue-200' 
                  : 'border-blue-200 bg-blue-50/70 text-blue-950',
                btnColor: 'bg-blue-700 hover:bg-blue-800 text-white',
                link: '/login?role=teacher'
              },
              {
                role: t('role_student'),
                desc: t('role_student_desc'),
                color: theme === 'dark' 
                  ? 'border-amber-900/60 bg-amber-950/20 text-amber-200' 
                  : 'border-amber-200 bg-amber-50/70 text-amber-950',
                btnColor: 'bg-amber-700 hover:bg-amber-800 text-white',
                link: '/login?role=student'
              },
              {
                role: t('role_parent'),
                desc: t('role_parent_desc'),
                color: theme === 'dark' 
                  ? 'border-rose-900/60 bg-rose-950/20 text-rose-200' 
                  : 'border-rose-200 bg-rose-50/70 text-rose-950',
                btnColor: 'bg-rose-700 hover:bg-rose-800 text-white',
                link: '/login?role=parent'
              }
            ].map((p, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition hover:shadow-md hover:scale-[1.01] ${p.color}`}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">{p.role}</h3>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {p.desc}
                  </p>
                </div>
                <div className={`mt-6 pt-4 border-t ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-200/80'
                }`}>
                  <Link
                    href={p.link}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold shadow-sm transition ${p.btnColor}`}
                  >
                    {t('enter_portal')}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className={`py-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('features_badge')}
            </div>
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('features_title')}
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              {t('features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: t('feat_1_title'),
                desc: t('feat_1_desc')
              },
              {
                icon: Smartphone,
                title: t('feat_2_title'),
                desc: t('feat_2_desc')
              },
              {
                icon: Calendar,
                title: t('feat_3_title'),
                desc: t('feat_3_desc')
              },
              {
                icon: Award,
                title: t('feat_4_title'),
                desc: t('feat_4_desc')
              },
              {
                icon: CreditCard,
                title: t('feat_5_title'),
                desc: t('feat_5_desc')
              },
              {
                icon: ShieldCheck,
                title: t('feat_6_title'),
                desc: t('feat_6_desc')
              }
            ].map((f, idx) => (
              <div 
                key={idx} 
                className={`rounded-3xl border p-8 shadow-sm transition hover:shadow-md ${
                  theme === 'dark'
                    ? 'border-slate-800/80 bg-slate-900/80 text-white hover:border-emerald-500'
                    : 'border-slate-200 bg-slate-50/70 text-slate-900 hover:border-emerald-300'
                }`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-6 ${
                  theme === 'dark'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE REGISTERED INSTITUTIONS */}
      <section id="institutions" className={`py-20 border-t transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-slate-800 text-white'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('inst_title')}
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              {t('inst_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEMO_INSTITUTIONS.map((inst) => (
              <div 
                key={inst.id} 
                className={`rounded-3xl border p-6 shadow-sm transition hover:shadow-md ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    theme === 'dark'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {inst.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {inst.name}
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {inst.type}
                    </span>
                  </div>
                </div>
                <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {inst.address}
                </p>
                <div className={`flex items-center justify-between text-xs border-t pt-3 ${
                  theme === 'dark'
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-100 text-slate-600'
                }`}>
                  <span>{t('currency_label')}: <strong>{inst.currency}</strong></span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t('active_tenant')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={`py-20 text-white transition-colors duration-200 ${
        theme === 'dark' ? 'bg-emerald-950 border-t border-emerald-900/60' : 'bg-emerald-800'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('cta_title')}
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg">
            {t('cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-950 shadow-lg hover:bg-slate-100 transition"
            >
              {t('cta_signin')}
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-emerald-600 bg-emerald-900/90 px-8 py-3.5 text-base font-semibold text-white hover:bg-emerald-900 transition"
            >
              {t('cta_register')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
