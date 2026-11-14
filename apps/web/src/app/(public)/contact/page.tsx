'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Need consultation on campus deployment, data migration, or enterprise subscription plans?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6 bg-emerald-900 text-white p-8 rounded-3xl">
            <h3 className="text-xl font-bold">Contact Details</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Our engineering and customer success teams are located in Dhaka, ready to assist your institution.
            </p>
            <div className="space-y-4 pt-4 text-xs text-emerald-100">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0" />
                <span>Academic Avenue, Dhanmondi, Dhaka-1205, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                <span>+880 1711-000001 (Mon–Sat, 9AM–6PM)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                <span>support@mic-campus.edu.bd</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Message Delivered</h3>
                <p className="text-xs text-slate-500">We will respond to your inquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input type="text" required placeholder="Prof. / Mr. / Ms." className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input type="email" required placeholder="name@institution.edu.bd" className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Message / Inquiry</label>
                  <textarea required rows={4} placeholder="Describe your campus requirements..." className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-emerald-800 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition flex items-center justify-center gap-2">
                  <Send className="h-3.5 w-3.5" /> Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
