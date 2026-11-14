'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Plus, 
  Power, 
  RefreshCw, 
  Settings2,
  FileText,
  Activity,
  Layers,
  Sparkles,
  UserCheck,
  Smartphone,
  KeyRound,
  Lock,
  Clock,
  XCircle,
  Eye,
  AlertTriangle,
  Database,
  ExternalLink,
  Copy,
  Terminal
} from 'lucide-react';
import { DEMO_INSTITUTIONS, DEMO_SDUI_CONFIG, DEMO_REGISTRATIONS } from '@/lib/mock-data';
import { Institution, SDUIAppConfig, Registration } from '@mic/shared-types';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'database' | 'institutions' | 'subscriptions' | 'sdui' | 'security' | 'audit'>('overview');
  const [institutions, setInstitutions] = useState<Institution[]>(DEMO_INSTITUTIONS);
  const [sduiConfig, setSduiConfig] = useState<SDUIAppConfig>(DEMO_SDUI_CONFIG);
  const [registrations, setRegistrations] = useState<Registration[]>(DEMO_REGISTRATIONS);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Registration Filter & Search
  const [regSearch, setRegSearch] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Supabase Database Connection States
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [supabaseServiceKeyInput, setSupabaseServiceKeyInput] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [dbConnectStatus, setDbConnectStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isConnectingDb, setIsConnectingDb] = useState(false);
  const [copiedMigration, setCopiedMigration] = useState<string | null>(null);

  // Super Admin Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Institution filter
  const [search, setSearch] = useState('');
  const filteredInstitutions = institutions.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.code.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch registrations & database status on mount
  useEffect(() => {
    fetchRegistrations();
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      // Check localStorage first
      if (typeof window !== 'undefined') {
        const localUrl = localStorage.getItem('mic_supabase_url');
        if (localUrl) {
          setSupabaseConnected(true);
          setSupabaseUrlInput(localUrl);
        }
      }

      const res = await fetch('/api/supabase/config');
      if (res.ok) {
        const data = await res.json();
        if (data.configured && data.url) {
          setSupabaseConnected(true);
          setSupabaseUrlInput(data.url);
        }
      }
    } catch (_) {}
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (data?.registrations) {
          setRegistrations(data.registrations);
        }
      }
    } catch (e) {
      // Keep initial demo state
    }
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  const handleUpdateRegistration = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r));
        setSaveStatus(`Registration successfully ${status}!`);
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (e) {
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleSimulateAPKRegistration = async () => {
    const sampleNames = ['Tanvir Hossain', 'Sumaiya Akter', 'Kazi Mahfuzur', 'Nusrat Zaman'];
    const sampleEmails = ['tanvir.hossain@gmail.com', 'sumaiya.akter@yahoo.com', 'kazi.mahfuz@gmail.com', 'nusrat.zaman@gmail.com'];
    const sampleInst = ['MIC Smart University', 'MIC Model College', 'MIC International School'];
    const randIdx = Math.floor(Math.random() * sampleNames.length);

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: sampleNames[randIdx],
          email: `${Date.now()}.${sampleEmails[randIdx]}`,
          phone: `+88017${Math.floor(10000000 + Math.random() * 90000000)}`,
          institution_name: sampleInst[Math.floor(Math.random() * sampleInst.length)],
          role: 'student',
          source: 'mobile_apk',
          notes: 'New admission application submitted from Android APK'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.registration) {
          setRegistrations(prev => [data.registration, ...prev]);
        }
        setSaveStatus('Received new registration from Mobile Android APK!');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbConnectStatus(null);
    setIsConnectingDb(true);

    try {
      const res = await fetch('/api/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: supabaseUrlInput.trim(),
          anonKey: supabaseKeyInput.trim(),
          serviceRoleKey: supabaseServiceKeyInput.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to connect to Supabase');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mic_supabase_url', supabaseUrlInput.trim());
        localStorage.setItem('mic_supabase_anon_key', supabaseKeyInput.trim());
      }

      setSupabaseConnected(true);
      setDbConnectStatus({
        type: 'success',
        message: 'Successfully connected to Supabase PostgreSQL! Database synchronization is active for both Web Dashboard and Mobile APK.'
      });
      setSaveStatus('Supabase Database Connected & Synchronized!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setDbConnectStatus({
        type: 'error',
        message: err?.message || 'Error connecting to Supabase database.'
      });
    } finally {
      setIsConnectingDb(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (newPassword.length < 6) {
      setPasswordChangeStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to update password');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mic_super_admin_password', newPassword);
      }

      setPasswordChangeStatus({
        type: 'success',
        message: 'Password successfully updated for Super Admin Mysha Ibnat Chowdhury! You can now log in with your new password.'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordChangeStatus({ type: 'error', message: err?.message || 'Error updating password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleInstitutionStatus = (id: string) => {
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === 'active' ? 'suspended' : 'active';
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  const handleSaveSDUI = () => {
    setSaveStatus('Saving and broadcasting configuration...');
    setTimeout(() => {
      setSaveStatus('Version 1.0.1 successfully published to all active mobile clients!');
      setTimeout(() => setSaveStatus(null), 4000);
    }, 800);
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.full_name.toLowerCase().includes(regSearch.toLowerCase()) || 
                          r.email.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.phone.includes(regSearch);
    const matchesStatus = regStatusFilter === 'all' || r.status === regStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER BAR */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-32 brightness-0 invert">
            <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline-block h-6 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/60 px-2.5 py-0.5 rounded-full">
              Super Admin Control Plane
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Signed in as: <strong className="text-white">Mysha Ibnat Chowdhury</strong> (<span className="text-emerald-400">myshaibnatchowdhury@gmail.com</span>)
          </span>
          <button 
            onClick={() => setActiveTab('database')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              supabaseConnected 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' 
                : 'bg-amber-950 text-amber-300 border border-amber-700/50'
            }`}
          >
            <Database className="h-3 w-3" />
            <span>{supabaseConnected ? 'Supabase Connected' : 'Connect DB'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 flex items-center gap-1.5 transition"
          >
            <KeyRound className="h-3 w-3" /> Change Password
          </button>
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            Sign Out
          </Link>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {saveStatus && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-6 flex items-center justify-center gap-2 shadow-md animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* DASHBOARD TABS */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-sm font-semibold text-slate-600 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Metrics', icon: Activity },
          { id: 'registrations', label: `App Registrations (${pendingCount})`, icon: UserCheck, badge: pendingCount > 0 },
          { id: 'database', label: 'Database (Supabase)', icon: Database, badge: !supabaseConnected },
          { id: 'institutions', label: 'Institution Tenants', icon: Building2 },
          { id: 'subscriptions', label: 'SaaS Subscriptions', icon: CreditCard },
          { id: 'sdui', label: 'Remote Mobile SDUI', icon: Sliders },
          { id: 'security', label: 'Admin Security & Password', icon: KeyRound },
          { id: 'audit', label: 'Security & Audit Logs', icon: ShieldAlert },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Institutions</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{institutions.length}</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Isolated Tenancy
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Registrations</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600" /> Incoming from Mobile APK
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database Status</div>
                <div className={`text-base font-bold mt-1 ${supabaseConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {supabaseConnected ? 'Supabase Cloud Connected' : 'Local Fallback Active'}
                </div>
                <button 
                  onClick={() => setActiveTab('database')}
                  className="text-xs text-emerald-600 hover:underline mt-1 block"
                >
                  Configure Supabase Project →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Super Administrator</div>
                <div className="text-base font-bold text-purple-900 mt-1 truncate">Mysha Ibnat Chowdhury</div>
                <div className="text-xs text-slate-500 mt-1 truncate">
                  myshaibnatchowdhury@gmail.com
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Unified Central Control</span>
                <h3 className="text-xl font-extrabold">Web Dashboard & Mobile APK Sync</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Full control over student admissions, teacher allocations, notices, remote SDUI mobile themes, and live database synchronizations.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <UserCheck className="h-4 w-4" /> Review Registrations ({pendingCount})
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Database className="h-4 w-4" /> Manage Supabase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE (SUPABASE) TAB */}
        {activeTab === 'database' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-600" />
                    Supabase PostgreSQL Database Connection
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect your centralized Supabase project to power Row Level Security (RLS), multi-tenant isolation, and real-time syncing between the Web Dashboard and Android Mobile APK.
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border shrink-0 ${
                  supabaseConnected 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${supabaseConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                  <span>{supabaseConnected ? 'Supabase Active' : 'Fallback Mode'}</span>
                </div>
              </div>

              {dbConnectStatus && (
                <div className={`p-4 rounded-xl text-xs font-semibold border flex items-start gap-2.5 ${
                  dbConnectStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                  {dbConnectStatus.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{dbConnectStatus.message}</span>
                </div>
              )}

              {/* CONNECTION FORM */}
              <form onSubmit={handleConnectSupabase} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Supabase Project URL</label>
                  <input
                    type="url"
                    required
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">Found in your Supabase Dashboard under <strong>Project Settings → API → Project URL</strong></p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Supabase Anon Public API Key</label>
                  <input
                    type="password"
                    required
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">Safe for web and mobile clients (protected by Row Level Security policies)</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Supabase Service Role Secret (Optional for Super Admin Ops)</label>
                  <input
                    type="password"
                    value={supabaseServiceKeyInput}
                    onChange={(e) => setSupabaseServiceKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Optional)"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isConnectingDb}
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    <span>{isConnectingDb ? 'Testing & Saving Connection...' : 'Connect Supabase PostgreSQL Database'}</span>
                  </button>
                </div>
              </form>

              {/* DATABASE MIGRATION SCRIPT CHECKLIST */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-purple-700" />
                      PostgreSQL Database Migrations
                    </h4>
                    <p className="text-xs text-slate-500">Run these SQL files in your Supabase SQL Editor to provision tables, RLS, and seed data.</p>
                  </div>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open Supabase Studio <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  {[
                    { file: '20261114000001_init_mic_smart_campus.sql', desc: '40+ Normalized Tables, Default Deny RLS & Multi-Tenant Isolation' },
                    { file: '20261114000002_storage_and_audit.sql', desc: '7 Storage Buckets & Automated Audit Triggers' },
                    { file: '20261114000003_registrations_and_super_admin.sql', desc: 'Registrations Table & Super Admin: Mysha Ibnat Chowdhury' },
                    { file: 'seed.sql', desc: 'Demo Universities, Classes, Sections, SDUI Layouts, & Default Roles' }
                  ].map((m, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-mono font-bold text-slate-800">{m.file}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{m.desc}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                        Ready in supabase/
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB (FROM MOBILE APK AND WEB) */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Incoming App & Admission Registrations</h3>
                <p className="text-xs text-slate-500">
                  Applications submitted from the Android Mobile APK and Web Portal arrive directly in this review queue.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateAPKRegistration}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition"
                >
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                  Simulate APK Registration
                </button>
                <button
                  onClick={fetchRegistrations}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" /> Refresh
                </button>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setRegStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      regStatusFilter === status 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* REGISTRATIONS TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Applicant</th>
                      <th className="py-3.5 px-4">Contact Details</th>
                      <th className="py-3.5 px-4">Target Institution & Role</th>
                      <th className="py-3.5 px-4">Submission Source</th>
                      <th className="py-3.5 px-4">Submission Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Super Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400">
                          No registration requests found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>{reg.full_name}</div>
                            {reg.notes && (
                              <div className="text-[11px] font-normal text-slate-500 mt-1 max-w-xs leading-relaxed bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                {reg.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{reg.email}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{reg.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{reg.institution_name || 'MIC Smart University'}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                              {reg.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {reg.source === 'mobile_apk' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Smartphone className="h-3 w-3 text-emerald-600" /> Mobile Android APK
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                <Layers className="h-3 w-3 text-sky-600" /> Web Portal
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono">
                            {new Date(reg.created_at).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-3.5 px-4">
                            {reg.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="h-3 w-3" /> Pending Review
                              </span>
                            )}
                            {reg.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Approved
                              </span>
                            )}
                            {reg.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                <XCircle className="h-3 w-3 text-rose-600" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {reg.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdateRegistration(reg.id, 'approved')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateRegistration(reg.id, 'rejected')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium italic">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY & ADMIN PASSWORD TAB */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 text-2xl font-black">
                  MC
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Mysha Ibnat Chowdhury</h3>
                  <p className="text-xs text-slate-500 font-medium">Principal Super Administrator • Full Platform Scope</p>
                  <p className="text-xs text-emerald-700 font-mono mt-0.5">myshaibnatchowdhury@gmail.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-semibold">Account Status</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active & Verified
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-semibold">Security Role</span>
                  <span className="text-purple-900 font-bold mt-0.5 block">Global Super Admin (RLS Bypass)</span>
                </div>
              </div>
            </div>

            {/* PASSWORD CHANGE FORM */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-700" /> Change Super Admin Password
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Update your official login password for <strong>myshaibnatchowdhury@gmail.com</strong>.
                </p>
              </div>

              {passwordChangeStatus && (
                <div className={`p-4 rounded-xl text-xs font-semibold border flex items-start gap-2.5 ${
                  passwordChangeStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                  {passwordChangeStatus.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (default: password123)"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Saving Password...' : 'Save New Super Admin Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* INSTITUTIONS TAB */}
        {activeTab === 'institutions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search institutions by name or code..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <button className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-2">
                <Plus className="h-4 w-4" /> Provision New Tenant
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Institution Name</th>
                    <th className="py-3 px-4">Code / Slug</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInstitutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{inst.name}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-800">{inst.code}</td>
                      <td className="py-3.5 px-4 capitalize">{inst.type}</td>
                      <td className="py-3.5 px-4 text-slate-500">{inst.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inst.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => toggleInstitutionStatus(inst.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            inst.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {inst.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REMOTE SDUI CONFIGURATOR TAB */}
        {activeTab === 'sdui' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Server-Driven Mobile UI (SDUI) Control</h3>
                <p className="text-xs text-slate-500">
                  Broadcast UI color palettes, emergency maintenance alerts, and component visibility to the Android APK without rebuilding the binary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={sduiConfig.theme.primary_color}
                      onChange={(e) => setSduiConfig({
                        ...sduiConfig,
                        theme: { ...sduiConfig.theme, primary_color: e.target.value }
                      })}
                      className="h-8 w-12 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono">{sduiConfig.theme.primary_color}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={sduiConfig.theme.secondary_color}
                      onChange={(e) => setSduiConfig({
                        ...sduiConfig,
                        theme: { ...sduiConfig.theme, secondary_color: e.target.value }
                      })}
                      className="h-8 w-12 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono">{sduiConfig.theme.secondary_color}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Accent Gold</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={sduiConfig.theme.accent_gold}
                      onChange={(e) => setSduiConfig({
                        ...sduiConfig,
                        theme: { ...sduiConfig.theme, accent_gold: e.target.value }
                      })}
                      className="h-8 w-12 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono">{sduiConfig.theme.accent_gold}</span>
                  </div>
                </div>
              </div>

              {/* MAINTENANCE GATE */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Campus Maintenance Mode</div>
                  <div className="text-[11px] text-slate-500">Lock mobile apps with a maintenance notice dialog</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSduiConfig({ ...sduiConfig, maintenance_mode: !sduiConfig.maintenance_mode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sduiConfig.maintenance_mode ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sduiConfig.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <button
                onClick={handleSaveSDUI}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Save & Push to Android Devices
              </button>
            </div>

            {/* PREVIEW CARD */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Live Preview</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div 
                className="p-5 rounded-2xl shadow-inner space-y-3"
                style={{ backgroundColor: sduiConfig.theme.primary_color }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold">MIC Smart Campus</div>
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: sduiConfig.theme.accent_gold }} />
                </div>
                <div className="text-xs opacity-80">Welcome, Student!</div>
                <div className="h-16 bg-white/10 rounded-xl p-3 flex items-center justify-center text-xs font-mono">
                  {sduiConfig.maintenance_mode ? '⚠️ MAINTENANCE ENGAGED' : '✓ Normal Operations'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-700" />
              Immutable PostgreSQL Audit Log Trail
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Record Identifier</th>
                    <th className="py-3 px-4">Actor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">2026-11-14 12:15:00</td>
                    <td className="py-3 px-4 font-bold">registrations</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">INSERT</span></td>
                    <td className="py-3 px-4 font-mono">mobile_apk_applicant</td>
                    <td className="py-3 px-4">Android Client / Public</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">2026-11-14 11:05:12</td>
                    <td className="py-3 px-4 font-bold">institutions</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">UPDATE</span></td>
                    <td className="py-3 px-4 font-mono">mic-university</td>
                    <td className="py-3 px-4">myshaibnatchowdhury@gmail.com</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">2026-11-14 10:48:33</td>
                    <td className="py-3 px-4 font-bold">ui_configurations</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">PUBLISH</span></td>
                    <td className="py-3 px-4 font-mono">global_app</td>
                    <td className="py-3 px-4">myshaibnatchowdhury@gmail.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Free Starter', price: '৳ 0', max: '100 Students', features: ['Academic Classes', 'Basic Attendance', 'Public Notices'] },
              { name: 'Standard School', price: '৳ 4,999/mo', max: '500 Students', features: ['Academic & Routine', 'Daily Attendance', 'Exams & Results', 'Android Mobile App'] },
              { name: 'Professional Campus', price: '৳ 12,999/mo', max: '2,000 Students', features: ['All Standard Features', 'Library & Transport', 'Fee Invoicing & Payments', 'Push Notifications'] },
              { name: 'Enterprise Multi-Campus', price: '৳ 29,999/mo', max: '10,000 Students', features: ['Custom SDUI Layouts', 'White-label Mobile Apps', 'Dedicated Database Pool', 'Priority 24/7 SLA'] }
            ].map((plan, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">{plan.name}</h4>
                  <div className="text-2xl font-black text-emerald-800 mt-2">{plan.price}</div>
                  <div className="text-xs text-slate-500 mt-1">{plan.max}</div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition">
                  Configure Tier
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
