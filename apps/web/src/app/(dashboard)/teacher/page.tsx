'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  Bell, 
  FileCheck
} from 'lucide-react';
import { DEMO_STUDENT, DEMO_ROUTINE, DEMO_MARKS } from '@/lib/mock-data';

export default function TeacherDashboard() {
  const [marks, setMarks] = useState(88);
  const [marksSaved, setMarksSaved] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 brightness-0 invert">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline-block h-6 w-px bg-slate-700" />
          <span className="text-xs font-semibold text-slate-300">Faculty & Teacher Desk</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold">Dr. Nusrat Jahan</div>
            <div className="text-emerald-400 font-mono text-[11px]">Assistant Professor, CSE</div>
          </div>
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Assigned Classes</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">2 Batches</div>
            <div className="text-xs text-slate-500 mt-1">CSE 1st Year (A & B)</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Today's Lectures</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">2 Periods</div>
            <div className="text-xs text-slate-500 mt-1">Lab 402 & Room 305</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Pending Marks Entry</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">Quiz 2 (CSE-101)</div>
            <div className="text-xs text-slate-500 mt-1">Due by Nov 20</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-700" /> Today's Teaching Schedule
            </h3>
            <div className="space-y-3">
              {DEMO_ROUTINE.slice(0, 2).map(r => (
                <div key={r.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{r.subject_name}</div>
                    <div className="text-[11px] text-slate-500">Room: {r.room_number}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {r.start_time} - {r.end_time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-700" /> Gradebook & Marks Input
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{DEMO_STUDENT.first_name} {DEMO_STUDENT.last_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{DEMO_STUDENT.student_id_code}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-300 py-1 px-2 text-center font-bold"
                  />
                  <span className="text-slate-500">/ 100</span>
                </div>
              </div>

              <button
                onClick={() => setMarksSaved(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-800 font-bold text-white hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> Save Student Marks
              </button>

              {marksSaved && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Marks saved and updated in central database.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
