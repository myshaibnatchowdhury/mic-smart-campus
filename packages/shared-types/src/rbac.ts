export type PlatformRole = 
  | 'super_admin'
  | 'platform_admin'
  | 'support_admin'
  | 'billing_admin';

export type InstitutionRole =
  | 'institution_owner'
  | 'institution_admin'
  | 'principal'
  | 'vice_principal'
  | 'academic_coordinator'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'librarian'
  | 'transport_manager'
  | 'staff';

export type Role = PlatformRole | InstitutionRole;

export type PermissionCode =
  // Platform permissions
  | 'platform:manage_institutions'
  | 'platform:manage_subscriptions'
  | 'platform:manage_users'
  | 'platform:manage_settings'
  | 'platform:view_audit_logs'
  | 'platform:manage_sdui'
  
  // Institution administration
  | 'institution:manage_profile'
  | 'institution:manage_settings'
  | 'institution:manage_members'
  
  // Academic
  | 'academic:manage_sessions'
  | 'academic:manage_classes'
  | 'academic:manage_subjects'
  | 'academic:manage_routine'
  | 'academic:view_routine'
  
  // Students & Guardians
  | 'student:create'
  | 'student:edit'
  | 'student:view_all'
  | 'student:view_own'
  | 'guardian:manage'
  
  // Staff & Teachers
  | 'teacher:manage'
  | 'staff:manage'
  
  // Attendance
  | 'attendance:mark_students'
  | 'attendance:view_all'
  | 'attendance:view_own'
  | 'attendance:correct'
  
  // Examination & Results
  | 'exam:manage'
  | 'marks:enter'
  | 'marks:view_all'
  | 'marks:view_own'
  | 'results:publish'
  | 'results:view_own'
  
  // Fees & Finance
  | 'finance:manage_fees'
  | 'finance:record_payment'
  | 'finance:view_reports'
  | 'finance:view_own_dues'
  
  // Notices & Communication
  | 'notice:create'
  | 'notice:view'
  | 'notification:manage'
  
  // Library & Transport
  | 'library:manage_books'
  | 'library:issue_return'
  | 'transport:manage_routes';

export const ROLE_PERMISSIONS: Record<Role, PermissionCode[]> = {
  super_admin: [
    'platform:manage_institutions',
    'platform:manage_subscriptions',
    'platform:manage_users',
    'platform:manage_settings',
    'platform:view_audit_logs',
    'platform:manage_sdui',
    'institution:manage_profile',
    'institution:manage_settings',
    'institution:manage_members',
    'academic:manage_sessions',
    'academic:manage_classes',
    'academic:manage_subjects',
    'academic:manage_routine',
    'student:view_all',
    'finance:view_reports',
    'notice:create',
    'notice:view'
  ],
  platform_admin: [
    'platform:manage_institutions',
    'platform:manage_subscriptions',
    'platform:manage_users',
    'platform:view_audit_logs',
    'platform:manage_sdui'
  ],
  support_admin: [
    'platform:manage_institutions',
    'platform:manage_users',
    'platform:view_audit_logs'
  ],
  billing_admin: [
    'platform:manage_subscriptions',
    'platform:view_audit_logs'
  ],
  institution_owner: [
    'institution:manage_profile',
    'institution:manage_settings',
    'institution:manage_members',
    'academic:manage_sessions',
    'academic:manage_classes',
    'academic:manage_subjects',
    'academic:manage_routine',
    'student:create',
    'student:edit',
    'student:view_all',
    'teacher:manage',
    'staff:manage',
    'attendance:view_all',
    'attendance:correct',
    'exam:manage',
    'marks:enter',
    'marks:view_all',
    'results:publish',
    'finance:manage_fees',
    'finance:record_payment',
    'finance:view_reports',
    'notice:create',
    'notice:view',
    'library:manage_books',
    'transport:manage_routes'
  ],
  institution_admin: [
    'institution:manage_profile',
    'institution:manage_settings',
    'institution:manage_members',
    'academic:manage_sessions',
    'academic:manage_classes',
    'academic:manage_subjects',
    'academic:manage_routine',
    'student:create',
    'student:edit',
    'student:view_all',
    'teacher:manage',
    'staff:manage',
    'attendance:view_all',
    'attendance:correct',
    'exam:manage',
    'marks:enter',
    'marks:view_all',
    'results:publish',
    'finance:manage_fees',
    'finance:record_payment',
    'finance:view_reports',
    'notice:create',
    'notice:view',
    'library:manage_books',
    'transport:manage_routes'
  ],
  principal: [
    'institution:manage_settings',
    'academic:manage_sessions',
    'academic:manage_classes',
    'academic:manage_subjects',
    'academic:manage_routine',
    'student:view_all',
    'teacher:manage',
    'attendance:view_all',
    'exam:manage',
    'marks:view_all',
    'results:publish',
    'finance:view_reports',
    'notice:create',
    'notice:view'
  ],
  vice_principal: [
    'academic:manage_routine',
    'student:view_all',
    'attendance:view_all',
    'marks:view_all',
    'notice:create',
    'notice:view'
  ],
  academic_coordinator: [
    'academic:manage_classes',
    'academic:manage_subjects',
    'academic:manage_routine',
    'attendance:view_all',
    'exam:manage',
    'marks:enter',
    'marks:view_all',
    'notice:create',
    'notice:view'
  ],
  teacher: [
    'academic:view_routine',
    'student:view_all',
    'attendance:mark_students',
    'attendance:view_all',
    'marks:enter',
    'marks:view_all',
    'notice:create',
    'notice:view'
  ],
  student: [
    'academic:view_routine',
    'student:view_own',
    'attendance:view_own',
    'marks:view_own',
    'results:view_own',
    'finance:view_own_dues',
    'notice:view'
  ],
  parent: [
    'academic:view_routine',
    'student:view_own',
    'attendance:view_own',
    'marks:view_own',
    'results:view_own',
    'finance:view_own_dues',
    'notice:view'
  ],
  accountant: [
    'finance:manage_fees',
    'finance:record_payment',
    'finance:view_reports',
    'student:view_all',
    'notice:view'
  ],
  librarian: [
    'library:manage_books',
    'library:issue_return',
    'student:view_all',
    'notice:view'
  ],
  transport_manager: [
    'transport:manage_routes',
    'student:view_all',
    'notice:view'
  ],
  staff: [
    'notice:view'
  ]
};
