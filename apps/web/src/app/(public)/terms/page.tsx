import React from 'react';

export default function TermsPage() {
  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last Updated: November 2026</p>
        
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Institutional Subscriptions</h2>
          <p>
            Educational institutions subscribe to MIC Smart Campus plans on monthly or annual billing terms. Access to mobile apps, storage allocations, and module toggles is governed by the active subscription tier.
          </p>

          <h2 className="text-base font-bold text-slate-900">2. Responsible Administrative Usage</h2>
          <p>
            Tenant Admins are responsible for managing internal roles, student rosters, and authorized fee structures in accordance with local regulations and academic policies.
          </p>

          <h2 className="text-base font-bold text-slate-900">3. System Availability & Service Levels</h2>
          <p>
            MIC Smart Campus maintains a 99.9% uptime target across centralized database and realtime services.
          </p>
        </div>
      </div>
    </div>
  );
}
