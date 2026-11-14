'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Award, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { DEMO_STUDENT, DEMO_INVOICES, DEMO_NOTICES } from '@/lib/mock-data';
import { formatBDT } from '@/lib/utils';

export default function ParentDashboard() {
  const student = DEMO_STUDENT;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 brightness-0 invert">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline-block h-6 w-px bg-slate-700" />
          <span className="text-xs font-semibold text-rose-300">Guardian / Parent Portal</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold">Mohammad Faruk Hossain</div>
            <div className="text-slate-400 text-[11px]">Father & Primary Guardian</div>
          </div>
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              {student.first_name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Linked Child</div>
              <div className="text-xl font-bold text-slate-900">{student.first_name} {student.last_name}</div>
              <div className="text-xs text-slate-500 font-mono">ID: {student.student_id_code} • CSE 1st Year (Sec A)</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-[10px] font-semibold text-emerald-800 uppercase">Monthly Attendance</div>
              <div className="text-lg font-black text-emerald-900">96.2%</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <div className="text-[10px] font-semibold text-amber-800 uppercase">Latest Term GPA</div>
              <div className="text-lg font-black text-amber-900">3.88</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-700" /> Pending Fee Notices
            </h3>
            {DEMO_INVOICES.filter(inv => inv.due_amount > 0).map(inv => (
              <div key={inv.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{inv.title}</div>
                  <div className="text-[11px] text-slate-600">Due: {inv.due_date}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-black text-rose-700">{formatBDT(inv.due_amount)}</div>
                  <button 
                    onClick={() => alert('Proceed to secure bKash / Card checkout')}
                    className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-700" /> Parent Notices & Circulars
            </h3>
            <div className="space-y-3">
              {DEMO_NOTICES.map(n => (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{n.title}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
