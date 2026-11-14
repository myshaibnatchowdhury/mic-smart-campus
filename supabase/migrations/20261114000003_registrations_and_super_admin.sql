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
CREATE POLICY "registrations_insert_anon" ON public.registrations
    FOR INSERT WITH CHECK (TRUE);

-- Super Admins have full access to view, update status, and manage all registrations
CREATE POLICY "registrations_super_admin_manage" ON public.registrations
    FOR ALL USING (public.is_super_admin());

-- Tenant Admins can view registrations intended for their specific institution
CREATE POLICY "registrations_tenant_admin_view" ON public.registrations
    FOR SELECT USING (
        institution_id IN (SELECT institution_id FROM public.get_user_institution_ids()) 
        AND public.has_role(institution_id, 'institution_admin')
    );

-- Audit Trigger for Registrations
CREATE TRIGGER audit_registrations_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.registrations
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

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
