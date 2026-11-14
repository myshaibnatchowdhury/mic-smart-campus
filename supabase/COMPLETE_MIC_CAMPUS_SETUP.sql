
-- ==============================================================================
-- MIC SMART CAMPUS — COMPLETE IDEMPOTENT SUPABASE SETUP
-- Project URL: https://epctmfazlaganiecnobh.supabase.co
-- ==============================================================================

-- Safely remove any foreign key constraint on profiles that might block seeding
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- ==============================================================================
-- MIC SMART CAMPUS — ENTERPRISE DATABASE SCHEMA & MULTI-TENANT ARCHITECTURE
-- Migration: 20261114000001_init_mic_smart_campus.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. IDENTITY & TENANCY
-- ==============================================================================

-- Profiles linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    national_id TEXT,
    address TEXT,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Educational Institutions (Tenants)
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('school', 'college', 'university', 'institute')),
    logo_url TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    currency TEXT NOT NULL DEFAULT 'BDT',
    timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Institution Memberships
CREATE TABLE IF NOT EXISTS public.institution_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, user_id)
);

-- Roles (Platform and Institution scopes)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL CHECK (scope IN ('platform', 'institution')),
    is_system BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Permissions
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Role Permissions join table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Membership Roles join table
CREATE TABLE IF NOT EXISTS public.membership_roles (
    membership_id UUID NOT NULL REFERENCES public.institution_memberships(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (membership_id, role_id)
);

-- Invitations
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 2. ACADEMIC STRUCTURE
-- ==============================================================================

-- Academic Sessions (e.g. 2026-2027)
CREATE TABLE IF NOT EXISTS public.academic_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Departments / Faculties
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, code)
);

-- Classes / Grades
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    numeric_level INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, code)
);

-- Sections
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT DEFAULT 50,
    room_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, class_id, name)
);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    credit_hours NUMERIC(4,2) DEFAULT 3.0,
    is_optional BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, code)
);

-- Class Subjects
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    pass_marks NUMERIC(5,2) DEFAULT 33.0,
    total_marks NUMERIC(5,2) DEFAULT 100.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(class_id, subject_id)
);

-- ==============================================================================
-- 3. STUDENTS & GUARDIANS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_id_code TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE NOT NULL,
    blood_group TEXT,
    current_class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
    current_section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE RESTRICT,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE RESTRICT,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, student_id_code)
);

CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    occupation TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    can_pickup BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(student_id, guardian_id)
);

CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. TEACHERS & STAFF
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id_code TEXT NOT NULL,
    designation TEXT NOT NULL,
    qualification TEXT NOT NULL,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, teacher_id_code),
    UNIQUE(institution_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_id_code TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, staff_id_code),
    UNIQUE(institution_id, user_id)
);

-- Teacher assignments to classes & subjects
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    academic_session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Class Routines
CREATE TABLE IF NOT EXISTS public.class_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1: Sunday, 7: Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Academic Calendar
CREATE TABLE IF NOT EXISTS public.academic_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('holiday', 'exam', 'cultural', 'sports', 'meeting')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. ATTENDANCE MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks TEXT,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS public.teacher_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
    check_in_time TIME,
    check_out_time TIME,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(teacher_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS public.attendance_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    attendance_id UUID NOT NULL REFERENCES public.student_attendance(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    reason TEXT NOT NULL,
    corrected_by UUID NOT NULL REFERENCES public.profiles(id),
    corrected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. EXAMINATION & RESULTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('midterm', 'final', 'quiz', 'term')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.grading_scales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_name TEXT NOT NULL, -- 'A+', 'A', 'A-', 'B', 'C', 'D', 'F'
    min_mark NUMERIC(5,2) NOT NULL,
    max_mark NUMERIC(5,2) NOT NULL,
    grade_point NUMERIC(3,2) NOT NULL, -- 5.0, 4.0, 3.5 etc.
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    examination_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.0,
    is_absent BOOLEAN NOT NULL DEFAULT FALSE,
    remarks TEXT,
    entered_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(examination_id, subject_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.published_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    examination_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    total_marks NUMERIC(7,2) NOT NULL,
    gpa NUMERIC(4,2) NOT NULL,
    final_grade TEXT NOT NULL,
    class_rank INT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(examination_id, student_id)
);

-- ==============================================================================
-- 7. FEES & FINANCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, code)
);

CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    fee_category_id UUID NOT NULL REFERENCES public.fee_categories(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    title TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    due_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'partial', 'unpaid', 'overdue')),
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.student_invoices(id) ON DELETE CASCADE,
    payment_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank', 'bkash', 'nagad', 'card', 'manual')),
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'rejected')),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, payment_number)
);

CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    receipt_number TEXT NOT NULL UNIQUE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    receipt_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- 8. COMMUNICATION & NOTICES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'students', 'teachers', 'parents', 'class')),
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.notice_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    UNIQUE(notice_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('attendance', 'fee', 'exam', 'general', 'result')),
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    last_active TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. LIBRARY & TRANSPORT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    category TEXT NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    shelf_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.book_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    borrower_type TEXT NOT NULL CHECK (borrower_type IN ('student', 'teacher')),
    borrower_id UUID NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
    fine_amount NUMERIC(8,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    vehicle_number TEXT NOT NULL,
    model TEXT,
    capacity INT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, vehicle_number)
);

CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    route_name TEXT NOT NULL,
    start_point TEXT NOT NULL,
    end_point TEXT NOT NULL,
    fare NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 10. SAAS SUBSCRIPTIONS & PLATFORM SETTINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug IN ('free', 'basic', 'pro', 'enterprise')),
    price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    max_students INT NOT NULL DEFAULT 100,
    max_storage_gb INT NOT NULL DEFAULT 5,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled')),
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id)
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key TEXT NOT NULL UNIQUE,
    description TEXT,
    is_global BOOLEAN NOT NULL DEFAULT TRUE,
    enabled_institutions JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. SERVER-DRIVEN UI (REMOTE CONTROL)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ui_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    screen_id TEXT NOT NULL, -- 'student_dashboard', 'teacher_dashboard', 'parent_dashboard', 'global_app'
    version TEXT NOT NULL DEFAULT '1.0.0',
    config_data JSONB NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(institution_id, screen_id)
);

CREATE TABLE IF NOT EXISTS public.ui_configuration_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuration_id UUID NOT NULL REFERENCES public.ui_configurations(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    config_data JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 12. AUDIT LOGGING & SECURITY EVENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.login_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ip_address TEXT,
    user_agent TEXT,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    failure_reason TEXT
);

-- ==============================================================================
-- 13. INDEXES FOR PERFORMANCE & TENANCY
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.institution_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_inst ON public.institution_memberships(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_inst ON public.students(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_user ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_inst ON public.teachers(institution_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.student_attendance(student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_inst_class ON public.student_attendance(institution_id, class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam_student ON public.marks(examination_id, student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_student ON public.student_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_notices_inst ON public.notices(institution_id, target_audience);
CREATE INDEX IF NOT EXISTS idx_audit_logs_inst ON public.audit_logs(institution_id);

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ==============================================================================

-- Check if current authenticated user is a Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT COALESCE(
        (SELECT is_super_admin FROM public.profiles WHERE id = check_user_id),
        FALSE
    );
$$;

-- Parameterless overload for RLS (defaults to auth.uid())
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT COALESCE(
        (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
        FALSE
    );
$$;

-- Get list of institution IDs where user is an active member
CREATE OR REPLACE FUNCTION public.get_user_institution_ids(check_user_id UUID)
RETURNS TABLE (institution_id UUID)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT institution_id FROM public.institution_memberships
    WHERE user_id = check_user_id AND status = 'active';
$$;

-- Parameterless overload for RLS (defaults to auth.uid())
CREATE OR REPLACE FUNCTION public.get_user_institution_ids()
RETURNS TABLE (institution_id UUID)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT institution_id FROM public.institution_memberships
    WHERE user_id = auth.uid() AND status = 'active';
$$;

-- Check if user has specific role in an institution
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, check_inst_id UUID, role_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.institution_memberships im
        JOIN public.membership_roles mr ON mr.membership_id = im.id
        JOIN public.roles r ON r.id = mr.role_id
        WHERE im.user_id = check_user_id 
          AND im.institution_id = check_inst_id 
          AND im.status = 'active'
          AND r.code = role_code
    );
$$;

-- Convenience overload for RLS (defaults check_user_id to auth.uid())
CREATE OR REPLACE FUNCTION public.has_role(check_inst_id UUID, role_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT public.has_role(auth.uid(), check_inst_id, role_code);
$$;

-- Check if user is parent/guardian of a given student
CREATE OR REPLACE FUNCTION public.is_parent_of_student(parent_user_id UUID, check_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.guardians g
        JOIN public.student_guardians sg ON sg.guardian_id = g.id
        WHERE g.user_id = parent_user_id 
          AND sg.student_id = check_student_id
    );
$$;

-- Convenience overload for RLS (defaults parent_user_id to auth.uid())
CREATE OR REPLACE FUNCTION public.is_parent_of_student(check_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT public.is_parent_of_student(auth.uid(), check_student_id);
$$;

-- Automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, is_super_admin)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'is_super_admin')::boolean, FALSE)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 15. ENABLE ROW LEVEL SECURITY & DEFINE STRICT POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile; Super Admins view all
DROP POLICY IF EXISTS "profiles_select_own_or_super" ON public.profiles;
CREATE POLICY "profiles_select_own_or_super" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_super_admin(auth.uid()))
    WITH CHECK (id = auth.uid() OR public.is_super_admin(auth.uid()));

-- Institutions: Super admin can do all; Members can select their own active institutions
DROP POLICY IF EXISTS "institutions_super_admin_all" ON public.institutions;
CREATE POLICY "institutions_super_admin_all" ON public.institutions
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "institutions_member_select" ON public.institutions;
CREATE POLICY "institutions_member_select" ON public.institutions
    FOR SELECT TO authenticated
    USING (id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())));

-- Institution Memberships: Members can see members of their institutions; Super admin full access
DROP POLICY IF EXISTS "memberships_super_admin_all" ON public.institution_memberships;
CREATE POLICY "memberships_super_admin_all" ON public.institution_memberships
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "memberships_tenant_select" ON public.institution_memberships;
CREATE POLICY "memberships_tenant_select" ON public.institution_memberships
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())));

-- Academic Sessions, Classes, Sections, Subjects, Routines: Read by tenant members, managed by admins
DROP POLICY IF EXISTS "academic_select_tenant" ON public.classes;
CREATE POLICY "academic_select_tenant" ON public.classes
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())) OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "classes_admin_manage" ON public.classes;
CREATE POLICY "classes_admin_manage" ON public.classes
    FOR ALL TO authenticated
    USING (
        public.is_super_admin(auth.uid()) OR 
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'institution_owner')
    );

DROP POLICY IF EXISTS "sections_select_tenant" ON public.sections;
CREATE POLICY "sections_select_tenant" ON public.sections
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())) OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "subjects_select_tenant" ON public.subjects;
CREATE POLICY "subjects_select_tenant" ON public.subjects
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())) OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "class_routines_select_tenant" ON public.class_routines;
CREATE POLICY "class_routines_select_tenant" ON public.class_routines
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Students:
-- Super admin: ALL
-- Institution admin / teacher: SELECT all in tenant
-- Student: SELECT only own row
-- Parent: SELECT only linked child
DROP POLICY IF EXISTS "students_super_admin" ON public.students;
CREATE POLICY "students_super_admin" ON public.students
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "students_tenant_admin_manage" ON public.students;
CREATE POLICY "students_tenant_admin_manage" ON public.students
    FOR ALL TO authenticated
    USING (
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'institution_owner')
    );

DROP POLICY IF EXISTS "students_teacher_select" ON public.students;
CREATE POLICY "students_teacher_select" ON public.students
    FOR SELECT TO authenticated
    USING (
        public.has_role(auth.uid(), institution_id, 'teacher') OR
        public.has_role(auth.uid(), institution_id, 'principal')
    );

DROP POLICY IF EXISTS "students_own_select" ON public.students;
CREATE POLICY "students_own_select" ON public.students
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_parent_of_student(auth.uid(), id));

-- Student Attendance:
DROP POLICY IF EXISTS "attendance_super_admin" ON public.student_attendance;
CREATE POLICY "attendance_super_admin" ON public.student_attendance
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "attendance_tenant_admin_teacher" ON public.student_attendance;
CREATE POLICY "attendance_tenant_admin_teacher" ON public.student_attendance
    FOR ALL TO authenticated
    USING (
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'teacher')
    );

DROP POLICY IF EXISTS "attendance_student_parent_view" ON public.student_attendance;
CREATE POLICY "attendance_student_parent_view" ON public.student_attendance
    FOR SELECT TO authenticated
    USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.is_parent_of_student(auth.uid(), student_id)
    );

-- Marks:
DROP POLICY IF EXISTS "marks_super_admin" ON public.marks;
CREATE POLICY "marks_super_admin" ON public.marks
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "marks_tenant_teacher_admin" ON public.marks;
CREATE POLICY "marks_tenant_teacher_admin" ON public.marks
    FOR ALL TO authenticated
    USING (
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'teacher')
    );

DROP POLICY IF EXISTS "marks_student_parent_view" ON public.marks;
CREATE POLICY "marks_student_parent_view" ON public.marks
    FOR SELECT TO authenticated
    USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.is_parent_of_student(auth.uid(), student_id)
    );

-- Invoices:
DROP POLICY IF EXISTS "invoices_super_admin" ON public.student_invoices;
CREATE POLICY "invoices_super_admin" ON public.student_invoices
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "invoices_tenant_admin" ON public.student_invoices;
CREATE POLICY "invoices_tenant_admin" ON public.student_invoices
    FOR ALL TO authenticated
    USING (
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'accountant')
    );

DROP POLICY IF EXISTS "invoices_student_parent_view" ON public.student_invoices;
CREATE POLICY "invoices_student_parent_view" ON public.student_invoices
    FOR SELECT TO authenticated
    USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        public.is_parent_of_student(auth.uid(), student_id)
    );

-- Notices:
DROP POLICY IF EXISTS "notices_tenant_select" ON public.notices;
CREATE POLICY "notices_tenant_select" ON public.notices
    FOR SELECT TO authenticated
    USING (institution_id IN (SELECT institution_id FROM public.get_user_institution_ids(auth.uid())) OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "notices_tenant_admin_manage" ON public.notices;
CREATE POLICY "notices_tenant_admin_manage" ON public.notices
    FOR ALL TO authenticated
    USING (
        public.is_super_admin(auth.uid()) OR
        public.has_role(auth.uid(), institution_id, 'institution_admin') OR
        public.has_role(auth.uid(), institution_id, 'teacher')
    );

-- Server-Driven UI Configurations:
DROP POLICY IF EXISTS "sdui_view_all_authenticated" ON public.ui_configurations;
CREATE POLICY "sdui_view_all_authenticated" ON public.ui_configurations
    FOR SELECT TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "sdui_manage_super_admin" ON public.ui_configurations;
CREATE POLICY "sdui_manage_super_admin" ON public.ui_configurations
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));


-- Ensure constraint is removed even if table already existed
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- ==============================================================================
-- MIC SMART CAMPUS — STORAGE BUCKETS, SECURITY POLICIES & AUDIT TRIGGERS
-- Migration: 20261114000002_storage_and_audit.sql
-- ==============================================================================

-- Create buckets in storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('institution-logos', 'institution-logos', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('profile-images', 'profile-images', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('notices', 'notices', TRUE, 15728640, ARRAY['image/png', 'image/jpeg', 'application/pdf']),
    ('institution-assets', 'institution-assets', TRUE, 20971520, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']),
    ('student-documents', 'student-documents', FALSE, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('teacher-documents', 'teacher-documents', FALSE, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('report-cards', 'report-cards', FALSE, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public reads for public buckets
DROP POLICY IF EXISTS "Public Read for Public Buckets" ON storage.objects;
CREATE POLICY "Public Read for Public Buckets" ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('institution-logos', 'profile-images', 'notices', 'institution-assets'));

-- Authenticated upload for avatars and logos
DROP POLICY IF EXISTS "Authenticated Upload for Images" ON storage.objects;
CREATE POLICY "Authenticated Upload for Images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('profile-images', 'institution-logos', 'notices', 'institution-assets'));

-- Private Documents Access: Tenant Admin or Student own documents
DROP POLICY IF EXISTS "Tenant Documents Restricted Select" ON storage.objects;
CREATE POLICY "Tenant Documents Restricted Select" ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id IN ('student-documents', 'teacher-documents', 'report-cards') AND (
        public.is_super_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.institution_memberships
            WHERE user_id = auth.uid() AND status = 'active'
        )
    )
);

-- ==============================================================================
-- AUDIT LOGGING FUNCTION & TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    inst_id UUID := NULL;
BEGIN
    IF TG_TABLE_NAME IN ('students', 'teachers', 'student_attendance', 'marks', 'student_invoices', 'notices') THEN
        IF TG_OP = 'DELETE' THEN
            inst_id := OLD.institution_id;
        ELSE
            inst_id := NEW.institution_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'institutions' THEN
        IF TG_OP = 'DELETE' THEN
            inst_id := OLD.id;
        ELSE
            inst_id := NEW.id;
        END IF;
    END IF;

    INSERT INTO public.audit_logs (
        institution_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data
    )
    VALUES (
        inst_id,
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT
            ELSE NEW.id::TEXT
        END,
        CASE 
            WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW)
            ELSE NULL
        END
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS audit_students ON public.students;
DROP TRIGGER IF EXISTS audit_students ON public.students;
CREATE TRIGGER audit_students AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_marks ON public.marks;
DROP TRIGGER IF EXISTS audit_marks ON public.marks;
CREATE TRIGGER audit_marks AFTER INSERT OR UPDATE OR DELETE ON public.marks
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_invoices ON public.student_invoices;
DROP TRIGGER IF EXISTS audit_invoices ON public.student_invoices;
CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON public.student_invoices
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_institutions ON public.institutions;
DROP TRIGGER IF EXISTS audit_institutions ON public.institutions;
CREATE TRIGGER audit_institutions AFTER INSERT OR UPDATE OR DELETE ON public.institutions
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();


-- ==============================================================================
-- MIC SMART CAMPUS — MIGRATION 003: REGISTRATIONS & SUPER ADMIN UPDATE
-- 20261114000003_registrations_and_super_admin.sql
-- ==============================================================================

-- 1. Create Registrations Table for Mobile APK & Web Portal Applications
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    institution_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'parent', 'institution_admin', 'staff')),
    source TEXT NOT NULL DEFAULT 'mobile_apk' CHECK (source IN ('mobile_apk', 'web_portal')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Anonymous applicants can submit registration applications from Mobile APK or Web
DROP POLICY IF EXISTS "registrations_insert_anon" ON public.registrations;
CREATE POLICY "registrations_insert_anon" ON public.registrations
    FOR INSERT WITH CHECK (TRUE);

-- Super Admins have full access to view, update status, and manage all registrations
DROP POLICY IF EXISTS "registrations_super_admin_manage" ON public.registrations;
CREATE POLICY "registrations_super_admin_manage" ON public.registrations
    FOR ALL USING (public.is_super_admin());

-- Tenant Admins can view registrations intended for their specific institution
DROP POLICY IF EXISTS "registrations_tenant_admin_view" ON public.registrations;
CREATE POLICY "registrations_tenant_admin_view" ON public.registrations
    FOR SELECT USING (
        institution_id IN (SELECT institution_id FROM public.get_user_institution_ids()) 
        AND public.has_role(institution_id, 'institution_admin')
    );

-- Audit Trigger for Registrations
DROP TRIGGER IF EXISTS audit_registrations_trigger ON public.registrations;
CREATE TRIGGER audit_registrations_trigger AFTER INSERT OR UPDATE OR DELETE ON public.registrations
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();


-- Provision auth.users record for Super Admin Mysha Ibnat Chowdhury
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000099',
    'authenticated',
    'authenticated',
    'myshaibnatchowdhury@gmail.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Mysha Ibnat Chowdhury","is_super_admin":true}'::jsonb,
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Configure Super Admin Profile: Mysha Ibnat Chowdhury
INSERT INTO public.profiles (id, email, full_name, phone, is_super_admin, status)
VALUES (
    '00000000-0000-0000-0000-000000000099',
    'myshaibnatchowdhury@gmail.com',
    'Mysha Ibnat Chowdhury',
    '+8801700000000',
    TRUE,
    'active'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_super_admin = TRUE,
    status = 'active';

-- Also seed sample pending registrations from Mobile APK
INSERT INTO public.registrations (full_name, email, phone, institution_name, role, source, status, notes)
VALUES
    ('Sadia Islam', 'sadia.islam2026@gmail.com', '+8801712345678', 'MIC Smart University', 'student', 'mobile_apk', 'pending', 'Applied for CSE undergraduate program via Android APK'),
    ('Farhan Kabir', 'farhan.kabir@yahoo.com', '+8801819876543', 'MIC Model College', 'student', 'mobile_apk', 'pending', 'HSC Science admission application via Mobile App'),
    ('Anisur Rahman', 'anisur.rahman.dev@gmail.com', '+8801911223344', 'MIC Smart University', 'teacher', 'mobile_apk', 'pending', 'Faculty application for Computer Science Lecturer'),
    ('Mehedi Hasan', 'mehedi.hasan@gmail.com', '+8801615566778', 'MIC International School', 'parent', 'mobile_apk', 'approved', 'Parent account registered for Grade 5 student')
ON CONFLICT DO NOTHING;


-- ==============================================================================
-- MIC SMART CAMPUS — DEFAULT SEED DATA
-- seed.sql
-- ==============================================================================

-- 1. System Roles
INSERT INTO public.roles (id, code, name, description, scope, is_system)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'super_admin', 'Super Admin', 'Platform global administrator with full unrestricted access', 'platform', TRUE),
    ('00000000-0000-0000-0000-000000000002', 'platform_admin', 'Platform Admin', 'Platform operator', 'platform', TRUE),
    ('00000000-0000-0000-0000-000000000003', 'institution_owner', 'Institution Owner', 'Owner and top administrative authority of institution', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000004', 'institution_admin', 'Institution Admin', 'Main institutional operational administrator', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000005', 'principal', 'Principal', 'Academic and executive head', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000006', 'teacher', 'Teacher', 'Faculty member with classroom and gradebook control', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000007', 'student', 'Student', 'Enrolled learner accessing coursework, attendance, fees, exams', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000008', 'parent', 'Parent / Guardian', 'Parent accessing linked children records', 'institution', TRUE),
    ('00000000-0000-0000-0000-000000000009', 'accountant', 'Accountant', 'Finance and fee collection administrator', 'institution', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 2. Subscription Plans
INSERT INTO public.subscription_plans (id, name, slug, price_monthly, price_yearly, max_students, max_storage_gb, features)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Free Starter', 'free', 0.00, 0.00, 100, 2, '["basic_academic", "attendance", "notices"]'::jsonb),
    ('10000000-0000-0000-0000-000000000002', 'Standard School', 'basic', 4999.00, 49990.00, 500, 20, '["academic", "attendance", "notices", "exams", "fees", "mobile_app"]'::jsonb),
    ('10000000-0000-0000-0000-000000000003', 'Professional Campus', 'pro', 12999.00, 129990.00, 2000, 100, '["academic", "attendance", "notices", "exams", "fees", "library", "transport", "mobile_app", "sms_gateway"]'::jsonb),
    ('10000000-0000-0000-0000-000000000004', 'Enterprise Multi-Campus', 'enterprise', 29999.00, 299990.00, 10000, 500, '["all_features", "white_label", "priority_support", "custom_sdui", "api_access"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- 3. Default Demo Tenants (Educational Institutions)
INSERT INTO public.institutions (id, code, name, type, address, phone, email, website, currency, timezone, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'mic-university', 'MIC Smart University', 'university', 'Campus 1, Academic Avenue, Dhaka, Bangladesh', '+8801711000001', 'contact@mic-university.edu.bd', 'https://university.mic.edu.bd', 'BDT', 'Asia/Dhaka', 'active'),
    ('b0000000-0000-0000-0000-000000000002', 'mic-college', 'MIC Model College', 'college', 'College Road, Dhanmondi, Dhaka, Bangladesh', '+8801711000002', 'info@mic-college.edu.bd', 'https://college.mic.edu.bd', 'BDT', 'Asia/Dhaka', 'active'),
    ('c0000000-0000-0000-0000-000000000003', 'mic-school', 'MIC International School', 'school', 'Gulshan-2, Dhaka, Bangladesh', '+8801711000003', 'admissions@mic-school.edu.bd', 'https://school.mic.edu.bd', 'BDT', 'Asia/Dhaka', 'active')
ON CONFLICT (code) DO NOTHING;

-- 4. Academic Sessions
INSERT INTO public.academic_sessions (id, institution_id, name, start_date, end_date, is_current)
VALUES
    ('aa000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-2027 Academic Year', '2026-01-01', '2026-12-31', TRUE),
    ('bb000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', '2026-2027 Session', '2026-07-01', '2027-06-30', TRUE)
ON CONFLICT DO NOTHING;

-- 5. Classes & Sections for MIC University
INSERT INTO public.classes (id, institution_id, name, code, numeric_level)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CSE 1st Year', 'CSE-1', 1),
    ('c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'BBA 1st Year', 'BBA-1', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.sections (id, institution_id, class_id, name, capacity, room_number)
VALUES
    ('11000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Section A', 60, 'Lab 402'),
    ('11000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Section B', 60, 'Lab 403')
ON CONFLICT DO NOTHING;

-- 6. Subjects
INSERT INTO public.subjects (id, institution_id, name, code, credit_hours)
VALUES
    ('12000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'CSE-101', 3.0),
    ('12000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Database Systems', 'CSE-102', 3.0),
    ('12000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Discrete Mathematics', 'MATH-101', 3.0)
ON CONFLICT DO NOTHING;

-- 7. Default Global Server-Driven UI Configuration
INSERT INTO public.ui_configurations (screen_id, version, config_data, is_published)
VALUES
    ('global_app', '1.0.0', '{
        "version": "1.0.0",
        "min_supported_version": "1.0.0",
        "force_update": false,
        "maintenance_mode": false,
        "theme": {
            "primary_color": "#064E3B",
            "secondary_color": "#047857",
            "accent_gold": "#D97706",
            "background_light": "#F8FAFC",
            "background_dark": "#0F172A",
            "card_radius": 16,
            "font_family": "Inter"
        },
        "screens": {
            "student_dashboard": {
                "components": [
                    {"id": "announcement", "type": "announcement_bar", "order": 1, "visible": true},
                    {"id": "stats", "type": "stats_card", "order": 2, "visible": true},
                    {"id": "quick_actions", "type": "quick_actions_grid", "order": 3, "visible": true},
                    {"id": "routine", "type": "routine_timeline", "order": 4, "visible": true},
                    {"id": "notices", "type": "recent_notices", "order": 5, "visible": true},
                    {"id": "exams", "type": "upcoming_exams", "order": 6, "visible": true},
                    {"id": "results", "type": "recent_results", "order": 7, "visible": true}
                ]
            }
        }
    }'::jsonb, TRUE)
ON CONFLICT (institution_id, screen_id) DO NOTHING;

-- 8. Super Administrator: Mysha Ibnat Chowdhury
INSERT INTO public.profiles (id, email, full_name, phone, is_super_admin, status)
VALUES (
    '00000000-0000-0000-0000-000000000099',
    'myshaibnatchowdhury@gmail.com',
    'Mysha Ibnat Chowdhury',
    '+8801700000000',
    TRUE,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Registrations from Mobile APK
INSERT INTO public.registrations (full_name, email, phone, institution_name, role, source, status, notes)
VALUES
    ('Sadia Islam', 'sadia.islam2026@gmail.com', '+8801712345678', 'MIC Smart University', 'student', 'mobile_apk', 'pending', 'Applied for CSE undergraduate program via Android APK'),
    ('Farhan Kabir', 'farhan.kabir@yahoo.com', '+8801819876543', 'MIC Model College', 'student', 'mobile_apk', 'pending', 'HSC Science admission application via Mobile App'),
    ('Anisur Rahman', 'anisur.rahman.dev@gmail.com', '+8801911223344', 'MIC Smart University', 'teacher', 'mobile_apk', 'pending', 'Faculty application for Computer Science Lecturer'),
    ('Mehedi Hasan', 'mehedi.hasan@gmail.com', '+8801615566778', 'MIC International School', 'parent', 'mobile_apk', 'approved', 'Parent account registered for Grade 5 student')
ON CONFLICT DO NOTHING;

