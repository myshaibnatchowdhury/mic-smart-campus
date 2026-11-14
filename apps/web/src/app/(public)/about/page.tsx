import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Server, Globe2, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            About MIC Smart Campus
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Next-Generation Academic Infrastructure for Bangladesh
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            MIC Smart Campus is an enterprise-grade Multi-Tenant Software-as-a-Service (SaaS) platform engineered to streamline education management across Bangladeshi schools, colleges, and universities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <ShieldCheck className="h-8 w-8 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">PostgreSQL Tenant Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every data entity is guarded by PostgreSQL Row Level Security (RLS) policies. Tenant A can never read, modify, or expose Tenant B's data under any circumstance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Server className="h-8 w-8 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">Server-Driven Mobile Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our Flutter Android client renders layout widgets, dashboard tiles, colors, and banners directly from live Supabase configuration without forcing store updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Globe2 className="h-8 w-8 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">Bangladeshi Academic Standards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Native support for BDT currency, Asia/Dhaka timezone, DD-MM-YYYY date formats, and GPA scales aligned with the National Curriculum and Higher Secondary Education boards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Award className="h-8 w-8 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">Audit Trails & Zero Fabrication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every mark entry, fee collection, and attendance correction records an immutable audit trail with timestamp, user ID, and IP address for complete transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
