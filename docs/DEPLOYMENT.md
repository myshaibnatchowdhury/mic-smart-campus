# MIC SMART CAMPUS — PRODUCTION DEPLOYMENT GUIDE

## 1. Supabase Cloud Database Deployment

### Step 1: Migration Rollout
Using the Supabase CLI:
```bash
supabase link --project-ref <your-supabase-project-ref>
supabase db push
```
Or execute through Supabase Studio SQL Editor:
1. `supabase/migrations/20261114000001_init_mic_smart_campus.sql`
2. `supabase/migrations/20261114000002_storage_and_audit.sql`

### Step 2: Storage Buckets Verification
Ensure the following buckets are active in Supabase Storage:
- `institution-logos` (Public)
- `profile-images` (Public)
- `notices` (Public)
- `institution-assets` (Public)
- `student-documents` (Private)
- `teacher-documents` (Private)
- `report-cards` (Private)

---

## 2. Next.js Web Deployment (Vercel)

### Environment Variables:
Configure the following in the Vercel Dashboard under **Project Settings -> Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`: `https://<project-ref>.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY`: `<service-role-key>` (Server side only!)
- `NEXT_PUBLIC_APP_NAME`: `MIC Smart Campus`
- `NEXT_PUBLIC_APP_TAGLINE`: `Learn • Connect • Grow`

### Deploy Command:
```bash
vercel --prod
```

---

## 3. Flutter Android APK Distribution

### Debug APK Build:
```bash
flutter build apk --debug
```
Verified artifact path:
`dist/android/MIC-Smart-Campus-debug.apk`

### Installation onto Physical Device or Emulator:
```bash
adb install -r dist/android/MIC-Smart-Campus-debug.apk
```
