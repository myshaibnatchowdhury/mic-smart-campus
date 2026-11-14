# MIC SMART CAMPUS — API SPECIFICATION & INTEGRATION GUIDE

## 1. Authentication & Base Endpoints
All API requests use the Supabase PostgREST and Auth APIs.

- **Base URL**: `https://<project-ref>.supabase.co/rest/v1`
- **Auth Header**: `Authorization: Bearer <JWT_USER_TOKEN>`
- **API Key Header**: `apikey: <SUPABASE_ANON_KEY>`

---

## 2. API Endpoints by Domain

### 2.1. Authentication & Profiles
- `POST /auth/v1/token?grant_type=password` - User login
- `POST /auth/v1/signup` - User registration
- `GET /rest/v1/profiles?id=eq.<user_id>` - Fetch authenticated user profile

### 2.2. Institutions (Tenancy)
- `GET /rest/v1/institutions` - Fetch current user's authorized institutions (protected by RLS)
- `POST /rest/v1/institutions` - Provision new tenant (Super Admin only)
- `PATCH /rest/v1/institutions?id=eq.<id>` - Update tenant settings / suspend status

### 2.3. Students & Admissions
- `GET /rest/v1/students?institution_id=eq.<id>` - List institutional students
- `POST /rest/v1/students` - Admit new student (Tenant Admin only)
- `GET /rest/v1/students?user_id=eq.<auth.uid()>` - Student self-lookup

### 2.4. Attendance Tracking
- `GET /rest/v1/student_attendance?class_id=eq.<id>&attendance_date=eq.<date>` - Daily sheet
- `POST /rest/v1/student_attendance` - Batch attendance mark (Teacher / Admin)
- `PATCH /rest/v1/attendance_corrections` - Audit-tracked attendance amendment

### 2.5. Examinations & Gradebook
- `GET /rest/v1/examinations?institution_id=eq.<id>` - List exams
- `POST /rest/v1/marks` - Enter student subject marks (Teacher / Admin)
- `GET /rest/v1/published_results?student_id=eq.<id>` - Student report card

### 2.6. Fees & Invoices
- `GET /rest/v1/student_invoices?student_id=eq.<id>` - Student dues
- `POST /rest/v1/payments` - Record payment transaction (Cash, Bank, bKash)
- `PATCH /rest/v1/payments?id=eq.<id>` - Accountant verification & receipt generation

### 2.7. Server-Driven UI (SDUI)
- `GET /rest/v1/ui_configurations?screen_id=eq.global_app` - Fetch active remote mobile layout
- `PATCH /rest/v1/ui_configurations?id=eq.<id>` - Super Admin remote publish
