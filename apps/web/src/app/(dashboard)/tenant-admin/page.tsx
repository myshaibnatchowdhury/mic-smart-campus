'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Users, 
  Calendar, 
  Award, 
  CreditCard, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Search, 
  Clock, 
  FileCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  DEMO_INSTITUTIONS, 
  DEMO_STUDENT, 
  DEMO_CLASSES, 
  DEMO_ROUTINE, 
  DEMO_INVOICES, 
  DEMO_NOTICES 
} from '@/lib/mock-data';
import { formatBDT, formatDateBD } from '@/lib/utils';

export default function TenantAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'routine' | 'attendance' | 'exams' | 'fees' | 'notices'>('overview');
  const institution = DEMO_INSTITUTIONS[0]; // MIC Smart University

  // Attendance state
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Notice creation state
  const [notices, setNotices] = useState(DEMO_NOTICES);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    const n = {
      id: `not-${Date.now()}`,
      institution_id: institution.id,
      title: newNoticeTitle,
      content: newNoticeContent,
      target_audience: 'all' as const,
      is_pinned: false,
      published_at: new Date().toISOString(),
      author_id: 'u0000000-0000-0000-0000-000000000002',
      created_at: new Date().toISOString()
    };
    setNotices([n, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* TENANT HEADER */}
      <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-32 brightness-0 invert">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline-block h-6 w-px bg-emerald-800" />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {institution.name}
              <span className="text-[10px] bg-emerald-800/80 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                {institution.code}
              </span>
            </div>
            <div className="text-[11px] text-emerald-300">Tenant Administrator Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-200">Admin: <strong className="text-white">Prof. Tanvir Ahmed</strong></span>
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 transition">
            Sign Out
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-sm font-semibold text-slate-600 overflow-x-auto">
        {[
          { id: 'overview', label: 'Institutional Overview', icon: Building2 },
          { id: 'students', label: 'Students Roster', icon: Users },
          { id: 'routine', label: 'Class Routine', icon: Calendar },
          { id: 'attendance', label: 'Live Attendance', icon: FileCheck },
          { id: 'exams', label: 'Exams & GPA', icon: Award },
          { id: 'fees', label: 'Invoicing & Fees', icon: CreditCard },
          { id: 'notices', label: 'Notice Board', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-emerald-700 text-emerald-900' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1,420</div>
                <div className="text-xs text-emerald-600 mt-1">2026-2027 Academic Session</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">94.8%</div>
                <div className="text-xs text-slate-500 mt-1">1,346 Present • 74 Absent</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Fee Dues</div>
                <div className="text-2xl font-bold text-amber-700 mt-1">৳ 185,500</div>
                <div className="text-xs text-slate-500 mt-1">42 unpaid student invoices</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Exam</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">Midterm Fall</div>
                <div className="text-xs text-emerald-600 mt-1">Starts Dec 01, 2026</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Today's Academic Schedule (Section A)</h3>
                <div className="divide-y divide-slate-100">
                  {DEMO_ROUTINE.map(r => (
                    <div key={r.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{r.subject_name}</div>
                        <div className="text-xs text-slate-500">Instructor: {r.teacher_name} • Room: {r.room_number}</div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {r.start_time} - {r.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Institution Metadata</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Currency</span>
                    <span className="font-semibold text-slate-900">{institution.currency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Timezone</span>
                    <span className="font-semibold text-slate-900">{institution.timezone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Contact Phone</span>
                    <span className="font-semibold text-slate-900">{institution.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Active Session</span>
                    <span className="font-semibold text-emerald-700">2026-2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS ROSTER */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name or ID..."
                  className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs"
                />
              </div>
              <button 
                onClick={() => alert('Student Admission Dialog: Enter student personal info, select class/section, assign guardian.')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition"
              >
                <Plus className="h-4 w-4" /> Admit New Student
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class / Section</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Admission Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{DEMO_STUDENT.student_id_code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{DEMO_STUDENT.first_name} {DEMO_STUDENT.last_name}</td>
                    <td className="py-3.5 px-4">CSE 1st Year (Section A)</td>
                    <td className="py-3.5 px-4 font-semibold text-rose-700">{DEMO_STUDENT.blood_group}</td>
                    <td className="py-3.5 px-4 font-mono">{formatDateBD(DEMO_STUDENT.admission_date)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        {DEMO_STUDENT.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIVE ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Class Attendance Sheet</h3>
                <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-GB')} • Class: CSE 1st Year (Section A)</p>
              </div>
              <button
                onClick={() => setAttendanceMarked(true)}
                className="rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> Save Attendance Session
              </button>
            </div>

            {attendanceMarked && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Attendance successfully committed to database with audit log entry.</span>
              </div>
            )}

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{DEMO_STUDENT.first_name} {DEMO_STUDENT.last_name}</div>
                  <div className="text-slate-500 font-mono">{DEMO_STUDENT.student_id_code}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    PRESENT
                  </span>
                  <button className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100">Late</button>
                  <button className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100">Absent</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVOICING & FEES */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Student Invoices & Dues</h3>
              <button 
                onClick={() => alert('New invoice generator: Select student or class, fee category, amount, due date.')}
                className="rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Generate Invoice
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Invoice #</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Total Amount</th>
                    <th className="py-2.5 px-4">Paid</th>
                    <th className="py-2.5 px-4">Due</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEMO_INVOICES.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold">{inv.invoice_number}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{inv.title}</td>
                      <td className="py-3 px-4 font-bold">{formatBDT(inv.total_amount)}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{formatBDT(inv.paid_amount)}</td>
                      <td className="py-3 px-4 text-rose-700 font-semibold">{formatBDT(inv.due_amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NOTICES */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Publish Notice</h3>
              <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. Schedule for Sports Week 2026"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Notice Body Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Enter detailed notice announcements..."
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-800 font-bold text-white hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"
                >
                  <Bell className="h-3.5 w-3.5" /> Broadcast Notice
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Campus Notices</h3>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{n.title}</h4>
                      {n.is_pinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          PINNED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      Published: {formatDateBD(n.published_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
