import { z } from 'zod';

export const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

export const phoneSchema = z.string().regex(bdPhoneRegex, {
  message: 'Invalid Bangladeshi phone number (e.g. +8801712345678 or 01712345678)'
});

export const institutionCreateSchema = z.object({
  name: z.string().min(3, 'Institution name must be at least 3 characters'),
  code: z.string().min(2).max(20).regex(/^[a-z0-9-]+$/, 'Code must be lowercase alphanumeric with hyphens'),
  type: z.enum(['school', 'college', 'university', 'institute']),
  email: z.string().email(),
  phone: phoneSchema,
  address: z.string().min(5),
  currency: z.string().default('BDT'),
  timezone: z.string().default('Asia/Dhaka')
});

export const studentAdmissionSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  current_class_id: z.string().uuid(),
  current_section_id: z.string().uuid(),
  session_id: z.string().uuid(),
  guardian_name: z.string().min(2),
  guardian_phone: phoneSchema,
  guardian_relationship: z.string().min(2)
});

export const attendanceRecordSchema = z.object({
  student_id: z.string().uuid(),
  class_id: z.string().uuid(),
  section_id: z.string().uuid(),
  attendance_date: z.string(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  remarks: z.string().optional()
});

export const marksEntrySchema = z.object({
  examination_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  student_id: z.string().uuid(),
  marks_obtained: z.number().min(0).max(100),
  is_absent: z.boolean().default(false),
  remarks: z.string().optional()
});

export const noticeCreateSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  target_audience: z.enum(['all', 'students', 'teachers', 'parents', 'class']),
  class_id: z.string().uuid().optional().nullable(),
  is_pinned: z.boolean().default(false)
});

export const sduiComponentSchema = z.object({
  id: z.string(),
  type: z.enum([
    'banner_slider',
    'stats_card',
    'quick_actions_grid',
    'attendance_summary',
    'fee_due_card',
    'routine_timeline',
    'recent_notices',
    'upcoming_exams',
    'recent_results',
    'announcement_bar'
  ]),
  title: z.string().optional(),
  order: z.number(),
  visible: z.boolean(),
  props: z.record(z.any()).optional(),
  roles_allowed: z.array(z.string()).optional()
});

export const sduiConfigSchema = z.object({
  version: z.string(),
  min_supported_version: z.string(),
  force_update: z.boolean(),
  maintenance_mode: z.boolean(),
  maintenance_message: z.string().nullable().optional(),
  theme: z.object({
    primary_color: z.string(),
    secondary_color: z.string(),
    accent_gold: z.string(),
    background_light: z.string(),
    background_dark: z.string(),
    card_radius: z.number(),
    font_family: z.string()
  }),
  screens: z.record(z.object({
    components: z.array(sduiComponentSchema)
  }))
});

export const registrationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: phoneSchema,
  institution_name: z.string().optional(),
  institution_id: z.string().uuid().optional(),
  role: z.enum(['student', 'teacher', 'parent', 'institution_admin']).default('student'),
  source: z.enum(['mobile_apk', 'web_portal']).default('mobile_apk'),
  notes: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
});
