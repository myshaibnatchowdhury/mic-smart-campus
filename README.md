# MIC Smart Campus — Multi-Tenant Academic Management Platform

> **Learn • Connect • Grow**

[![Flutter](https://img.shields.io/badge/Flutter-3.50.0-02569B?logo=flutter)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-000000?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Security](https://img.shields.io/badge/RLS-Default%20Deny-059669)](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🏛️ Overview

**MIC Smart Campus** is an enterprise-grade Multi-Tenant Academic Management & Smart Campus Platform designed for educational institutions across Bangladesh (schools, colleges, and universities). The platform delivers a unified web portal for platform super administrators, institution administrators, educators, students, and guardians, combined with a native Flutter Android mobile app empowered by Server-Driven UI (SDUI).

---

## 📦 Monorepo Structure

```
mic-smart-campus/
├── apps/
│   ├── mobile/                  # Complete Flutter Android mobile application
│   └── web/                     # Complete Next.js 14 App Router web portal
├── supabase/
│   ├── migrations/              # Production PostgreSQL schema, RLS, & audit triggers
│   ├── config.toml              # Supabase CLI and local studio configuration
│   └── seed.sql                 # Sample tenants (University, College, School), demo roles, & SDUI
├── packages/
│   ├── shared-types/            # Shared TypeScript data models, RBAC, & SDUI contracts
│   └── shared-validation/       # Shared Zod validation schemas with BD phone regex
├── dist/
│   └── android/
│       └── MIC-Smart-Campus-debug.apk # Built and verified Android Debug APK
├── docs/                        # Complete technical documentation
│   ├── ARCHITECTURE.md          # Multi-tenancy, SDUI, and RBAC architecture
│   ├── DATABASE_SCHEMA.md       # Full PostgreSQL data dictionary and ER diagrams
│   ├── API_DOCUMENTATION.md     # REST and Supabase API contracts
│   ├── INSTALLATION.md          # Local developer setup guide
│   ├── DEPLOYMENT.md            # Vercel, Supabase, and Android deployment
│   ├── SECURITY.md              # Security audit and anti-tampering report
│   ├── TEST_REPORT.md           # Automated test reports
│   └── APK_BUILD.md             # Android compilation specifications
├── .env.example                 # Environment configuration template
└── README.md                    # Project overview
```

---

## 🚀 Key Modules & Capabilities

1. **Multi-Tenant SaaS Isolation**: Built on PostgreSQL Row Level Security (RLS). Institutional data is isolated at the database kernel level.
2. **Server-Driven UI (SDUI)**: Super Admins can dynamically reorder widgets, change color themes, push announcement banners, and toggle maintenance mode on live mobile apps without rebuilding the APK.
3. **5 Dedicated Portals**:
   - **Super Admin**: Tenant provisioning, subscription plan billing, immutable audit logs, and remote SDUI controller.
   - **Tenant Admin**: Session routines, student admissions, teacher rosters, class fees, and campus notices.
   - **Faculty / Teacher**: Daily attendance register and examination mark entry with automated grade calculation.
   - **Student**: Personalized mobile dashboard, class routine timeline, attendance %, published report cards, and online fee dues.
   - **Parent / Guardian**: Verified multi-child monitoring, attendance alerts, and fee checkout.
4. **Bangladesh Academic Standards**: Native BDT (৳) currency, Asia/Dhaka timezone, DD-MM-YYYY date formats, and national GPA scales.

---

## 🛠️ Quickstart

### 1. Web Portal Build & Verification
```bash
cd apps/web
npm install
npm run build
```

### 2. Android APK Build & Verification
```bash
cd apps/mobile
flutter pub get
flutter test
flutter build apk --debug
```

---

## 📄 License & Attribution
Developed for **MIC Smart Campus**. All rights reserved.
