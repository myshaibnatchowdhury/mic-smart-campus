'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Users, 
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Student Admission Form State
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'male',
    dob: '',
    institution: 'MIC Smart University',
    program: 'B.Sc in Computer Science & Engineering (CSE)',
    guardianName: '',
    guardianPhone: '',
    previousRecord: '',
    password: ''
  });

  // Institution Onboarding Form State
  const [institutionData, setInstitutionData] = useState({
    name: '',
    code: '',
    type: 'college',
    email: '',
    phone: '',
    address: '',
    currency: 'BDT',
    timezone: 'Asia/Dhaka'
  });

  const [submittedType, setSubmittedType] = useState<'student' | 'institution' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Student Admission Submit
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!studentData.fullName || !studentData.email || !studentData.phone) {
        throw new Error('Please fill in student name, email, and contact phone.');
      }

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: studentData.fullName,
          email: studentData.email,
          phone: studentData.phone,
          institution_name: studentData.institution,
          role: 'student',
          source: 'web_portal',
          password: studentData.password,
          notes: `Admission Application: Program/Class: ${studentData.program}, Guardian: ${studentData.guardianName || 'N/A'} (Phone: ${studentData.guardianPhone || 'N/A'}), DOB: ${studentData.dob || 'N/A'}, Gender: ${studentData.gender}, Previous Record: ${studentData.previousRecord || 'N/A'}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to submit admission application.');
      }

      setSubmittedType('student');
    } catch (err: any) {
      setError(err?.message || 'Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Institution Onboarding Submit
  const handleInstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!institutionData.name || !institutionData.code || !institutionData.email || !institutionData.phone) {
        throw new Error('Please fill in institution name, code, email, and contact phone.');
      }

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: `${institutionData.name} (Admin)`,
          email: institutionData.email,
          phone: institutionData.phone,
          institution_name: institutionData.name,
          role: 'institution_admin',
          source: 'web_portal',
          notes: `Institution Onboarding: Code ${institutionData.code}, Type ${institutionData.type}, Address: ${institutionData.address || 'N/A'}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to submit onboarding application.');
      }

      setSubmittedType('institution');
    } catch (err: any) {
      setError(err?.message || 'Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="relative h-12 w-36 mx-auto">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeTab === 'student' ? 'Student Admission & Registration' : 'Register Educational Institution'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {activeTab === 'student' 
              ? 'Apply for academic admission and register your student profile directly into the campus system'
              : 'Provision a dedicated multi-tenant campus database and administrative workspace'
            }
          </p>
        </div>

        {/* REGISTRATION TYPE TABS */}
        {!submittedType && (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setError(null); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Admission
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('institution'); setError(null); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'institution'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Institution Onboarding
            </button>
          </div>
        )}

        {/* ERROR NOTICE */}
        {error && (
          <div className="rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 border border-rose-200 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS CONFIRMATION STATE */}
        {submittedType === 'student' && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-950">Student Admission Submitted!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
              Your admission application for <strong>{studentData.fullName}</strong> has been registered and delivered directly to the Super Admin review queue (<strong>Mysha Ibnat Chowdhury</strong>).
            </p>
            
            <div className="bg-white p-4 rounded-xl border border-emerald-100 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-800">{studentData.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">{studentData.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Institution:</span>
                <span className="font-semibold text-emerald-800">{studentData.institution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Program / Class:</span>
                <span className="font-semibold text-slate-800">{studentData.program}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  Pending Admin Approval
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?role=student"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-md"
              >
                Proceed to Student Portal Login <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedType(null);
                  setStudentData({
                    fullName: '',
                    email: '',
                    phone: '',
                    gender: 'male',
                    dob: '',
                    institution: 'MIC Smart University',
                    program: 'B.Sc in Computer Science & Engineering (CSE)',
                    guardianName: '',
                    guardianPhone: '',
                    previousRecord: '',
                    password: ''
                  });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        )}

        {submittedType === 'institution' && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-950">Institution Registration Submitted!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
              Your onboarding request for <strong>{institutionData.name}</strong> has been routed to the Super Admin review queue. You will receive an invitation token to activate your administrative workspace.
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-md"
              >
                Go to Portal Login
              </Link>
            </div>
          </div>
        )}

        {/* STUDENT ADMISSION FORM */}
        {!submittedType && activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-emerald-700" /> Full Name (Student)
                </label>
                <input
                  type="text"
                  required
                  value={studentData.fullName}
                  onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                  placeholder="e.g. Tanvir Ahmed Chowdhury"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Student Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-emerald-700" /> Student Email
                </label>
                <input
                  type="email"
                  required
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  placeholder="tanvir.student@gmail.com"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-700" /> Contact Phone (BD)
                </label>
                <input
                  type="tel"
                  required
                  value={studentData.phone}
                  onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                  placeholder="+8801712345678"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Institution Select */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-emerald-700" /> Target Educational Institution
                </label>
                <select
                  value={studentData.institution}
                  onChange={(e) => setStudentData({ ...studentData, institution: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="MIC Smart University">MIC Smart University (Main Campus, Dhaka)</option>
                  <option value="MIC Model College">MIC Model College (Chittagong Campus)</option>
                  <option value="MIC International School">MIC International School (Sylhet Campus)</option>
                  <option value="MIC Polytechnic Institute">MIC Polytechnic & Vocational Institute</option>
                </select>
              </div>

              {/* Academic Program / Class */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-700" /> Academic Program / Class / Department
                </label>
                <select
                  value={studentData.program}
                  onChange={(e) => setStudentData({ ...studentData, program: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="B.Sc in Computer Science & Engineering (CSE)">B.Sc in Computer Science & Engineering (CSE)</option>
                  <option value="BBA - Bachelor of Business Administration">BBA - Bachelor of Business Administration</option>
                  <option value="B.Sc in Electrical & Electronic Engineering (EEE)">B.Sc in Electrical & Electronic Engineering (EEE)</option>
                  <option value="HSC Science (1st Year)">HSC Science (1st Year)</option>
                  <option value="HSC Business Studies">HSC Business Studies</option>
                  <option value="HSC Humanities">HSC Humanities</option>
                  <option value="Class 10 - Secondary (SSC)">Class 10 - Secondary (SSC)</option>
                  <option value="Class 9 - Secondary">Class 9 - Secondary</option>
                  <option value="A-Levels / Cambridge International">A-Levels / Cambridge International</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-700" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={studentData.dob}
                  onChange={(e) => setStudentData({ ...studentData, dob: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Gender</label>
                <select
                  value={studentData.gender}
                  onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Guardian Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-emerald-700" /> Guardian / Father Name
                </label>
                <input
                  type="text"
                  value={studentData.guardianName}
                  onChange={(e) => setStudentData({ ...studentData, guardianName: e.target.value })}
                  placeholder="e.g. Kabir Ahmed Chowdhury"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Guardian Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-700" /> Guardian Phone
                </label>
                <input
                  type="tel"
                  value={studentData.guardianPhone}
                  onChange={(e) => setStudentData({ ...studentData, guardianPhone: e.target.value })}
                  placeholder="+8801812345678"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Previous Academic GPA / Roll */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Previous Academic Result / GPA (Optional)</label>
                <input
                  type="text"
                  value={studentData.previousRecord}
                  onChange={(e) => setStudentData({ ...studentData, previousRecord: e.target.value })}
                  placeholder="e.g. HSC GPA 5.00, Board: Dhaka, Passing Year: 2026"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Password */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> Create Student Account Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    placeholder="Enter a secure password for portal sign-in"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-2.5 pl-3.5 pr-11 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <GraduationCap className="h-4 w-4 text-amber-400" />
              {loading ? 'Submitting Application...' : 'Submit Student Admission Application'}
            </button>
          </form>
        )}

        {/* INSTITUTION ONBOARDING FORM */}
        {!submittedType && activeTab === 'institution' && (
          <form onSubmit={handleInstitutionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institutionData.name}
                  onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                  placeholder="e.g. Dhaka Model College"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Subdomain / Code</label>
                <input
                  type="text"
                  required
                  value={institutionData.code}
                  onChange={(e) => setInstitutionData({ ...institutionData, code: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="e.g. dmc-edu"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Institution Type</label>
                <select
                  value={institutionData.type}
                  onChange={(e) => setInstitutionData({ ...institutionData, type: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="institute">Vocational / Institute</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Email</label>
                <input
                  type="email"
                  required
                  value={institutionData.email}
                  onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                  placeholder="admin@institution.edu.bd"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Phone (BD)</label>
                <input
                  type="tel"
                  required
                  value={institutionData.phone}
                  onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                  placeholder="+8801712345678"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Physical Campus Address</label>
                <input
                  type="text"
                  required
                  value={institutionData.address}
                  onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                  placeholder="Street, City, Division"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Building2 className="h-4 w-4 text-amber-400" />
              {loading ? 'Submitting Application...' : 'Submit Onboarding Application'}
            </button>
          </form>
        )}

        {/* BOTTOM HELPER */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign In to Academic Portal
          </Link>
        </div>

      </div>
    </div>
  );
}
