import { 
  Institution, 
  Profile, 
  Student, 
  AcademicClass, 
  ClassSection, 
  RoutineItem, 
  StudentInvoice, 
  Notice, 
  AttendanceRecord,
  StudentMark,
  SDUIAppConfig,
  DEFAULT_SDUI_CONFIG,
  Registration
} from '@mic/shared-types';

export const DEMO_INSTITUTIONS: Institution[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    code: 'mic-university',
    name: 'MIC Smart University',
    type: 'university',
    logo_url: '/logo.png',
    address: 'Campus 1, Academic Avenue, Dhaka-1205, Bangladesh',
    phone: '+8801711000001',
    email: 'contact@mic-university.edu.bd',
    website: 'https://university.mic.edu.bd',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    code: 'mic-college',
    name: 'MIC Model College',
    type: 'college',
    logo_url: '/logo.png',
    address: 'Dhanmondi, Dhaka-1209, Bangladesh',
    phone: '+8801711000002',
    email: 'info@mic-college.edu.bd',
    website: 'https://college.mic.edu.bd',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    code: 'mic-school',
    name: 'MIC International School',
    type: 'school',
    logo_url: '/logo.png',
    address: 'Gulshan-2, Dhaka-1212, Bangladesh',
    phone: '+8801711000003',
    email: 'admissions@mic-school.edu.bd',
    website: 'https://school.mic.edu.bd',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const DEMO_PROFILES: (Profile & { role: string; institution_id?: string })[] = [
  {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'myshaibnatchowdhury@gmail.com',
    full_name: 'Mysha Ibnat Chowdhury',
    phone: '+8801700000000',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_super_admin: true,
    status: 'active',
    role: 'super_admin',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000002',
    email: 'admin@mic-university.edu.bd',
    full_name: 'Prof. Tanvir Ahmed',
    phone: '+8801711000001',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_super_admin: false,
    status: 'active',
    role: 'institution_admin',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000003',
    email: 'teacher@mic-university.edu.bd',
    full_name: 'Dr. Nusrat Jahan',
    phone: '+8801712000001',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    is_super_admin: false,
    status: 'active',
    role: 'teacher',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000004',
    email: 'student@mic-university.edu.bd',
    full_name: 'Samiul Karim',
    phone: '+8801713000001',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_super_admin: false,
    status: 'active',
    role: 'student',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u0000000-0000-0000-0000-000000000005',
    email: 'parent@mic-university.edu.bd',
    full_name: 'Mohammad Faruk Hossain',
    phone: '+8801714000001',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_super_admin: false,
    status: 'active',
    role: 'parent',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const DEMO_STUDENT: Student = {
  id: 'st000000-0000-0000-0000-000000000001',
  institution_id: 'a0000000-0000-0000-0000-000000000001',
  user_id: 'u0000000-0000-0000-0000-000000000004',
  student_id_code: 'MIC-2026-0842',
  first_name: 'Samiul',
  last_name: 'Karim',
  gender: 'male',
  date_of_birth: '2005-08-14',
  blood_group: 'B+',
  current_class_id: 'c1000000-0000-0000-0000-000000000001',
  current_section_id: 's1000000-0000-0000-0000-000000000001',
  session_id: 'aa000000-0000-0000-0000-000000000001',
  admission_date: '2026-01-10',
  status: 'active',
  created_at: '2026-01-10T00:00:00Z',
  updated_at: '2026-01-10T00:00:00Z'
};

export const DEMO_CLASSES: AcademicClass[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', institution_id: 'a0000000-0000-0000-0000-000000000001', name: 'Computer Science & Engineering', code: 'CSE-1', numeric_level: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000002', institution_id: 'a0000000-0000-0000-0000-000000000001', name: 'Business Administration (BBA)', code: 'BBA-1', numeric_level: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000003', institution_id: 'a0000000-0000-0000-0000-000000000001', name: 'Electrical & Electronic Engineering', code: 'EEE-1', numeric_level: 1, created_at: '2026-01-01T00:00:00Z' }
];

export const DEMO_ROUTINE: RoutineItem[] = [
  { id: 'r1', institution_id: 'a0000000-0000-0000-0000-000000000001', class_id: 'c1000000-0000-0000-0000-000000000001', section_id: 's1000000-0000-0000-0000-000000000001', subject_id: 'sub1', teacher_id: 't1', day_of_week: 1, start_time: '09:00', end_time: '10:00', room_number: 'Lab 402', subject_name: 'Data Structures & Algorithms', teacher_name: 'Dr. Nusrat Jahan' },
  { id: 'r2', institution_id: 'a0000000-0000-0000-0000-000000000001', class_id: 'c1000000-0000-0000-0000-000000000001', section_id: 's1000000-0000-0000-0000-000000000001', subject_id: 'sub2', teacher_id: 't2', day_of_week: 1, start_time: '10:15', end_time: '11:15', room_number: 'Room 305', subject_name: 'Database Management Systems', teacher_name: 'Prof. Tanvir Ahmed' },
  { id: 'r3', institution_id: 'a0000000-0000-0000-0000-000000000001', class_id: 'c1000000-0000-0000-0000-000000000001', section_id: 's1000000-0000-0000-0000-000000000001', subject_id: 'sub3', teacher_id: 't3', day_of_week: 1, start_time: '11:30', end_time: '12:30', room_number: 'Room 201', subject_name: 'Discrete Mathematics', teacher_name: 'Dr. Shahriar Rahman' }
];

export const DEMO_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-1',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'st000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-11-0042',
    title: 'Spring Semester Tuition & Lab Fee',
    total_amount: 35000,
    paid_amount: 35000,
    due_amount: 0,
    status: 'paid',
    due_date: '2026-11-05',
    created_at: '2026-10-15T00:00:00Z'
  },
  {
    id: 'inv-2',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'st000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-11-0189',
    title: 'Midterm Examination & Library Card Renewal',
    total_amount: 4500,
    paid_amount: 0,
    due_amount: 4500,
    status: 'unpaid',
    due_date: '2026-11-25',
    created_at: '2026-11-01T00:00:00Z'
  }
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: 'not-1',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Fall 2026 Midterm Examination Schedule Published',
    content: 'The Midterm Examination for all undergraduate departments will commence from December 1st, 2026. Please collect your admit cards before November 28.',
    target_audience: 'all',
    is_pinned: true,
    published_at: '2026-11-12T09:00:00Z',
    author_id: 'u0000000-0000-0000-0000-000000000002',
    created_at: '2026-11-12T09:00:00Z'
  },
  {
    id: 'not-2',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Campus Hackathon 2026 Registration Open',
    content: 'All engineering students are invited to form teams of 3-4 members for the upcoming 36-hour National Smart Campus Hackathon.',
    target_audience: 'students',
    is_pinned: false,
    published_at: '2026-11-10T14:30:00Z',
    author_id: 'u0000000-0000-0000-0000-000000000003',
    created_at: '2026-11-10T14:30:00Z'
  }
];

export const DEMO_MARKS: StudentMark[] = [
  {
    id: 'm1',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    examination_id: 'ex-1',
    subject_id: 'sub1',
    student_id: 'st000000-0000-0000-0000-000000000001',
    marks_obtained: 88,
    max_marks: 100,
    grade: 'A+',
    gpa: 4.0,
    is_absent: false,
    entered_by: 'u0000000-0000-0000-0000-000000000003',
    created_at: '2026-11-05T00:00:00Z'
  },
  {
    id: 'm2',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    examination_id: 'ex-1',
    subject_id: 'sub2',
    student_id: 'st000000-0000-0000-0000-000000000001',
    marks_obtained: 82,
    max_marks: 100,
    grade: 'A',
    gpa: 3.75,
    is_absent: false,
    entered_by: 'u0000000-0000-0000-0000-000000000002',
    created_at: '2026-11-05T00:00:00Z'
  }
];

export const DEMO_SDUI_CONFIG: SDUIAppConfig = DEFAULT_SDUI_CONFIG;

export const DEMO_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    full_name: 'Sadia Islam',
    email: 'sadia.islam2026@gmail.com',
    phone: '+8801712345678',
    institution_name: 'MIC Smart University',
    role: 'student',
    source: 'mobile_apk',
    status: 'pending',
    notes: 'Applied for CSE undergraduate program via Android APK',
    created_at: '2026-11-14T08:30:00Z',
    updated_at: '2026-11-14T08:30:00Z'
  },
  {
    id: 'reg-002',
    full_name: 'Farhan Kabir',
    email: 'farhan.kabir@yahoo.com',
    phone: '+8801819876543',
    institution_name: 'MIC Model College',
    role: 'student',
    source: 'mobile_apk',
    status: 'pending',
    notes: 'HSC Science admission application via Mobile App',
    created_at: '2026-11-14T09:15:00Z',
    updated_at: '2026-11-14T09:15:00Z'
  },
  {
    id: 'reg-003',
    full_name: 'Anisur Rahman',
    email: 'anisur.rahman.dev@gmail.com',
    phone: '+8801911223344',
    institution_name: 'MIC Smart University',
    role: 'teacher',
    source: 'mobile_apk',
    status: 'pending',
    notes: 'Faculty application for Computer Science Lecturer',
    created_at: '2026-11-14T10:00:00Z',
    updated_at: '2026-11-14T10:00:00Z'
  },
  {
    id: 'reg-004',
    full_name: 'Mehedi Hasan',
    email: 'mehedi.hasan@gmail.com',
    phone: '+8801615566778',
    institution_name: 'MIC International School',
    role: 'parent',
    source: 'mobile_apk',
    status: 'approved',
    notes: 'Parent account registered for Grade 5 student',
    created_at: '2026-11-14T07:20:00Z',
    updated_at: '2026-11-14T07:45:00Z'
  }
];
