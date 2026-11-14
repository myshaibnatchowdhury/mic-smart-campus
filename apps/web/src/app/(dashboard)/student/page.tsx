'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  Bell, 
  BookOpen, 
  Bus, 
  UserCheck,
  Award,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { 
  DEMO_STUDENT, 
  DEMO_INSTITUTIONS, 
  DEMO_ROUTINE, 
  DEMO_INVOICES, 
  DEMO_NOTICES,
  DEMO_MARKS
} from '@/lib/mock-data';
import { formatBDT } from '@/lib/utils';

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>({
    first_name: 'Samiul',
    last_name: 'Karim',
    full_name: 'Samiul Karim',
    student_id_code: 'MIC-2026-0842',
    class_name: 'Computer Science & Engineering',
    section_name: 'Section A (3rd Year)',
    institution_name: 'MIC Smart University',
    email: 'student@mic-university.edu.bd',
    phone: '+880 1712-345678',
    blood_group: 'B+',
    attendance_percentage: 96.2,
    current_gpa: 3.88
  });
  const [isLoading, setIsLoading] = useState(true);

  const inst = DEMO_INSTITUTIONS[0];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('mic_logged_in_email') : null;
        if (storedEmail) {
          const res = await fetch(`/api/student/profile?email=${encodeURIComponent(storedEmail)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.student) {
              setStudent(data.student);
            }
          }
        }
      } catch (e) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 brightness-0 invert">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline-block h-6 w-px bg-emerald-700" />
          <span className="text-xs font-semibold text-emerald-200">{student.institution_name || inst.name}</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-white flex items-center justify-end gap-1">
              <span>{student.full_name || `${student.first_name} ${student.last_name}`}</span>
              <ShieldCheck className="h-3.5 w-3.5 text-amber-300 inline" />
            </div>
            <div className="text-emerald-300 font-mono text-[11px]">{student.student_id_code}</div>
          </div>
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-emerald-950 text-white hover:bg-emerald-800 transition">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        
        {/* WELCOME BANNER FOR THIS SPECIFIC STUDENT */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/40 text-amber-300 px-3 py-1 rounded-full border border-amber-300/30">
                Official Student Academic Profile
              </span>
              <span className="text-[10px] font-bold uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                ID: {student.student_id_code}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {student.first_name}!
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Enrolled in <strong>{student.class_name}</strong> ({student.section_name}) • {student.institution_name} • Session 2026-2027
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <div className="text-xs text-emerald-200">Attendance</div>
              <div className="text-2xl font-black text-amber-300 mt-1">{student.attendance_percentage}%</div>
              <div className="text-[10px] text-emerald-100">Verified Biometric</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
              <div className="text-xs text-emerald-200">Current CGPA</div>
              <div className="text-2xl font-black text-white mt-1">{student.current_gpa}</div>
              <div className="text-[10px] text-emerald-100">Honor Roll</div>
            </div>
          </div>
        </div>

        {/* INDIVIDUAL STUDENT PROFILE CARD */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center border border-emerald-200">
                {student.first_name ? student.first_name[0] : 'S'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  {student.full_name || `${student.first_name} ${student.last_name}`}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Student
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {student.student_id_code} • {student.institution_name}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> {student.email}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {student.phone}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Enrolled Program</span>
              <strong className="text-slate-900 font-bold block mt-0.5 line-clamp-1">{student.class_name}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Academic Section</span>
              <strong className="text-slate-900 font-bold block mt-0.5">{student.section_name}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Blood Group</span>
              <strong className="text-slate-900 font-bold block mt-0.5">{student.blood_group || 'B+'}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Database Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized & Isolated
              </span>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: Calendar, label: 'Routine', color: 'text-emerald-700 bg-emerald-50' },
            { icon: Award, label: 'Results', color: 'text-amber-700 bg-amber-50' },
            { icon: CreditCard, label: 'Fees', color: 'text-blue-700 bg-blue-50' },
            { icon: BookOpen, label: 'Library', color: 'text-purple-700 bg-purple-50' },
            { icon: Bus, label: 'Transport', color: 'text-rose-700 bg-rose-50' },
            { icon: Bell, label: 'Notices', color: 'text-teal-700 bg-teal-50' },
          ].map((action, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-emerald-300 transition">
              <div className={`p-2.5 rounded-xl ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">{action.label}</span>
            </div>
          ))}
        </div>

        {/* ROUTINE & RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TODAY'S ROUTINE */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-700" /> Today's Lecture Routine ({student.first_name})
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                3 Lectures
              </span>
            </div>

            <div className="space-y-3">
              {DEMO_ROUTINE.map(r => (
                <div key={r.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900">{r.subject_name}</div>
                    <div className="text-[11px] text-slate-500">Instructor: {r.teacher_name} • Room: {r.room_number}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                    {r.start_time} - {r.end_time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FEES & NOTICES */}
          <div className="lg:col-span-5 space-y-6">
            {/* FEES CARD */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-700" /> Student Invoices & Dues
                </h3>
              </div>
              {DEMO_INVOICES.filter(inv => inv.due_amount > 0).map(inv => (
                <div key={inv.id} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{inv.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{inv.invoice_number}</div>
                    </div>
                    <span className="text-xs font-black text-rose-700">{formatBDT(inv.due_amount)}</span>
                  </div>
                  <button 
                    onClick={() => alert('Online Payment: Supports bKash, Nagad, Cards and Bank receipt verification.')}
                    className="w-full py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition"
                  >
                    Pay Invoice Online
                  </button>
                </div>
              ))}
            </div>

            {/* NOTICES PREVIEW */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Bell className="h-4 w-4 text-emerald-700" /> Official Campus Announcements
              </h3>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900">{DEMO_NOTICES[0].title}</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{DEMO_NOTICES[0].content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
