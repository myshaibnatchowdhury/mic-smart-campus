import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="relative h-12 w-36 brightness-0 invert">
              <Image src="/logo.png" alt="MIC Smart Campus" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-400">
              Next-generation multi-tenant academic management ecosystem empowering schools, colleges, and universities across Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>Learn</span> • <span>Connect</span> • <span>Grow</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform Modules</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-emerald-400">Academic & Routine</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">Smart Attendance & Bio</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">Exams & Automated GPA</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">Online Fees & Invoicing</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400">Server-Driven Mobile App</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Institutional Portals</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-emerald-400">Super Admin Console</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">Institution Admin Desk</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">Faculty & Teacher Portal</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">Student Academic Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">Parent / Guardian Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact & Security</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>support@mic-campus.edu.bd</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Row Level Security (RLS) Enforced</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MIC Smart Campus. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-300">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
