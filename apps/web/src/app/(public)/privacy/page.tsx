import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy & Data Governance Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>
        
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Multi-Tenant Data Protection</h2>
          <p>
            MIC Smart Campus is architected with strict PostgreSQL Row Level Security (RLS) policies. Each institution operates within an isolated tenant partition. No institutional data is shared across tenants.
          </p>

          <h2 className="text-base font-bold text-slate-900">2. Student & Guardian Information</h2>
          <p>
            Student personal identification, birth records, guardian contacts, and financial transactions are accessible exclusively to authorized school personnel, verified teachers, and linked parents.
          </p>

          <h2 className="text-base font-bold text-slate-900">3. Biometric & Attendance Records</h2>
          <p>
            Attendance logs are captured solely for academic tracking and parental notification. Raw biometric credentials are never stored in plain text.
          </p>

          <h2 className="text-base font-bold text-slate-900">4. Audit Logs & Compliance</h2>
          <p>
            Modifications to grades, attendance, and fee invoices are logged immutably for institutional accreditation and anti-tamper compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
