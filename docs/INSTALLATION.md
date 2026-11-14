# MIC SMART CAMPUS — INSTALLATION & LOCAL SETUP GUIDE

## Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Flutter**: v3.24.0 or higher
- **Java**: JDK 17 (Eclipse Temurin or OpenJDK 17)
- **Android SDK**: API 34+ with `build-tools 34.0.0+`
- **Supabase CLI** (optional for local database container)

---

## 1. Monorepo Setup

```bash
git clone <repository_url> mic-smart-campus
cd mic-smart-campus
```

### Install Workspace Dependencies:
```bash
npm install
npm run build:packages
```

---

## 2. Supabase Backend Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Execute the migrations in order:
   - `supabase/migrations/20261114000001_init_mic_smart_campus.sql`
   - `supabase/migrations/20261114000002_storage_and_audit.sql`
3. Load the initial seed data:
   - `supabase/seed.sql`
4. Copy `.env.example` to `apps/web/.env.local`:
   ```bash
   cp .env.example apps/web/.env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 3. Next.js Web Application

```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Flutter Android Mobile Application

```bash
cd apps/mobile
flutter pub get
flutter run --debug
```

To build the debug APK:
```bash
flutter build apk --debug
```
The output will be produced at:
`apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`
