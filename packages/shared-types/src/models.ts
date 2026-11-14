import { Role } from './rbac.js';

export interface Profile {
  id: string; // references auth.users
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  national_id?: string | null;
  address?: string | null;
  is_super_admin: boolean;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  type: 'school' | 'college' | 'university' | 'institute';
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  currency: string; // default BDT
  timezone: string; // default Asia/Dhaka
  status: 'active' | 'suspended' | 'pending';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface InstitutionMembership {
  id: string;
  institution_id: string;
  user_id: string;
  role: Role;
  status: 'active' | 'inactive' | 'invited';
  joined_at: string;
  created_at: string;
  updated_at: string;
  institution?: Institution;
  profile?: Profile;
}

export interface AcademicSession {
  id: string;
  institution_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface AcademicClass {
  id: string;
  institution_id: string;
  department_id?: string | null;
  name: string;
  code: string;
  numeric_level?: number | null;
  created_at: string;
}

export interface ClassSection {
  id: string;
  institution_id: string;
  class_id: string;
  name: string;
  capacity?: number | null;
  room_number?: string | null;
  created_at: string;
  class?: AcademicClass;
}

export interface Subject {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  credit_hours?: number | null;
  is_optional: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  institution_id: string;
  user_id?: string | null;
  student_id_code: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  blood_group?: string | null;
  current_class_id: string;
  current_section_id: string;
  session_id: string;
  admission_date: string;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  created_at: string;
  updated_at: string;
  class?: AcademicClass;
  section?: ClassSection;
  profile?: Profile;
}

export interface Teacher {
  id: string;
  institution_id: string;
  user_id: string;
  teacher_id_code: string;
  designation: string;
  qualification: string;
  joining_date: string;
  department_id?: string | null;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
  profile?: Profile;
}

export interface AttendanceRecord {
  id: string;
  institution_id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string | null;
  recorded_by: string;
  created_at: string;
}

export interface Examination {
  id: string;
  institution_id: string;
  session_id: string;
  title: string;
  exam_type: 'midterm' | 'final' | 'quiz' | 'term';
  start_date: string;
  end_date: string;
  is_published: boolean;
  created_at: string;
}

export interface StudentMark {
  id: string;
  institution_id: string;
  examination_id: string;
  subject_id: string;
  student_id: string;
  marks_obtained: number;
  max_marks: number;
  grade?: string;
  gpa?: number;
  is_absent: boolean;
  remarks?: string | null;
  entered_by: string;
  created_at: string;
}

export interface StudentInvoice {
  id: string;
  institution_id: string;
  student_id: string;
  invoice_number: string;
  title: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  due_date: string;
  created_at: string;
  student?: Student;
}

export interface Notice {
  id: string;
  institution_id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'students' | 'teachers' | 'parents' | 'class';
  class_id?: string | null;
  is_pinned: boolean;
  published_at: string;
  author_id: string;
  created_at: string;
}

export interface RoutineItem {
  id: string;
  institution_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number; // 1 = Sunday, 7 = Saturday (or ISO 1 = Monday)
  start_time: string;
  end_time: string;
  room_number?: string | null;
  subject_name?: string;
  teacher_name?: string;
}

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  institution_id?: string | null;
  institution_name?: string | null;
  role: string;
  source: 'mobile_apk' | 'web_portal';
  status: 'pending' | 'approved' | 'rejected';
  notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}
