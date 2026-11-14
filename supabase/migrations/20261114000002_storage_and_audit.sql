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
CREATE POLICY "Public Read for Public Buckets"
ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('institution-logos', 'profile-images', 'notices', 'institution-assets'));

-- Authenticated upload for avatars and logos
CREATE POLICY "Authenticated Upload for Images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('profile-images', 'institution-logos', 'notices', 'institution-assets'));

-- Private Documents Access: Tenant Admin or Student own documents
CREATE POLICY "Tenant Documents Restricted Select"
ON storage.objects FOR SELECT TO authenticated
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
CREATE TRIGGER audit_students
    AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_marks ON public.marks;
CREATE TRIGGER audit_marks
    AFTER INSERT OR UPDATE OR DELETE ON public.marks
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_invoices ON public.student_invoices;
CREATE TRIGGER audit_invoices
    AFTER INSERT OR UPDATE OR DELETE ON public.student_invoices
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_institutions ON public.institutions;
CREATE TRIGGER audit_institutions
    AFTER INSERT OR UPDATE OR DELETE ON public.institutions
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
