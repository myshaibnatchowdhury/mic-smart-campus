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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Enterprise Multi-Tenant Smart Campus Solution
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Learn <span className="text-emerald-400">•</span> Connect <span className="text-emerald-400">•</span> <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Grow</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Empower your school, college, or university with <strong>MIC Smart Campus</strong> — the centralized cloud platform unifying academic management, live attendance, automated GPA results, fee collections, and native mobile apps with remote Server-Driven UI.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 hover:scale-[1.02]"
                >
                  Access Campus Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                >
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  Onboard Your Institution
                </Link>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-slate-400">PostgreSQL RLS Isolated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">Realtime</div>
                  <div className="text-xs text-slate-400">Server-Driven UI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">BDT / Dhaka</div>
                  <div className="text-xs text-slate-400">Native Localization</div>
                </div>
              </div>
            </div>

            {/* BRAND HERO LOGO & PREVIEW CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                  <div className="relative h-12 w-32">
                    <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" />
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live System
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-slate-400">Active Tenant</div>
                      <div className="text-sm font-bold text-white">MIC Smart University</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded border border-emerald-700/50">
                      Enterprise Tier
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-950/40 border border-emerald-900/40 p-3">
                      <div className="text-xs text-emerald-400 font-medium">Today's Attendance</div>
                      <div className="text-xl font-bold text-white mt-1">94.8%</div>
                      <div className="text-[10px] text-emerald-300">Biometric & Web sync</div>
                    </div>
                    <div className="rounded-xl bg-amber-950/30 border border-amber-900/40 p-3">
                      <div className="text-xs text-amber-400 font-medium">Pending Invoices</div>
                      <div className="text-xl font-bold text-white mt-1">৳ 12,450</div>
                      <div className="text-[10px] text-amber-300">bKash / Bank verified</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Server-Driven UI Remote Sync</span>
                      <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-300">
                      Super Admin can remotely customize mobile dashboards, toggle feature blocks, and update banner themes without requiring re-compilation of APK.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE PORTALS SHOWCASE */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dedicated Portals for Every Academic Role
            </h2>
            <p className="text-slate-600">
              Role-Based Access Control (RBAC) guarantees that each stakeholder sees strictly what they need with zero data leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                role: 'Super Admin',
                desc: 'Multi-tenant provisioning, subscription control, audit logs, and global SDUI configuration.',
                color: 'border-purple-200 bg-purple-50/50 text-purple-900',
                btnColor: 'bg-purple-700 hover:bg-purple-800',
                link: '/login?role=super_admin'
              },
              {
                role: 'Tenant Admin',
                desc: 'Academic sessions, class routines, teacher allocations, fee invoices, and institution settings.',
                color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
                btnColor: 'bg-emerald-700 hover:bg-emerald-800',
                link: '/login?role=institution_admin'
              },
              {
                role: 'Teacher / Faculty',
                desc: 'Assigned classroom roster, real-time student attendance, and examination marks grading.',
                color: 'border-blue-200 bg-blue-50/50 text-blue-900',
                btnColor: 'bg-blue-700 hover:bg-blue-800',
                link: '/login?role=teacher'
              },
              {
                role: 'Student',
                desc: 'Daily routine schedule, personal attendance %, examination report cards, and pending fees.',
                color: 'border-amber-200 bg-amber-50/50 text-amber-900',
                btnColor: 'bg-amber-700 hover:bg-amber-800',
                link: '/login?role=student'
              },
              {
                role: 'Parent / Guardian',
                desc: 'Linked children academic performance, real-time absence alerts, and online fee payments.',
                color: 'border-rose-200 bg-rose-50/50 text-rose-900',
                btnColor: 'bg-rose-700 hover:bg-rose-800',
                link: '/login?role=parent'
              }
            ].map((p, idx) => (
              <div key={idx} className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${p.color}`}>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">{p.role}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link
                    href={p.link}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white shadow-sm transition ${p.btnColor}`}
                  >
                    Enter Portal
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Platform Capabilities</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Complete Institutional Governance
            </h2>
            <p className="text-slate-600">
              Eliminate disconnected spreadsheets and siloed legacy systems with an all-in-one verified campus solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Strict Multi-Tenant Isolation',
                desc: 'Every query enforces PostgreSQL Row Level Security (RLS) checked directly in the database engine. Institution data is isolated by default.'
              },
              {
                icon: Smartphone,
                title: 'Server-Driven Flutter App',
                desc: 'Dynamic Android mobile client dynamically reads its widget layout, branding, themes, and banners from Supabase in real-time.'
              },
              {
                icon: Calendar,
                title: 'Class Routine & Schedules',
                desc: 'Visual multi-period routine generator with clash detection across teachers, rooms, and sections.'
              },
              {
                icon: Award,
                title: 'Exams & Automated GPA',
                desc: 'Configurable Bangladeshi grading scales (A+, A, B, C, D, F) with automated calculation of GPA, total marks, and published report cards.'
              },
              {
                icon: CreditCard,
                title: 'Fee Management & Invoicing',
                desc: 'Automated invoice generation for tuition, admission, exams, and transport with support for manual cash collection and mobile banking.'
              },
              {
                icon: ShieldCheck,
                title: 'Comprehensive Audit Logs',
                desc: 'Every sensitive operation on student profiles, examination marks, and billing triggers an immutable database audit log with user and IP.'
              }
            ].map((f, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-emerald-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-6">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE REGISTERED INSTITUTIONS */}
      <section id="institutions" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Institutions Powered by MIC Smart Campus
            </h2>
            <p className="text-slate-600">
              Supporting universities, colleges, and high schools under a unified enterprise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEMO_INSTITUTIONS.map((inst) => (
              <div key={inst.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
                    {inst.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{inst.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                      {inst.type}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4">{inst.address}</p>
                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <span>Currency: <strong>{inst.currency}</strong></span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active Tenant
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg">
            Deploy MIC Smart Campus today with turnkey Supabase multi-tenancy and ready-to-run Android APK.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-950 shadow-lg hover:bg-slate-100 transition"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-emerald-700 bg-emerald-800 px-8 py-3.5 text-base font-semibold text-white hover:bg-emerald-700 transition"
            >
              Register New Campus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
