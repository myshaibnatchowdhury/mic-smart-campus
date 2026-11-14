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
