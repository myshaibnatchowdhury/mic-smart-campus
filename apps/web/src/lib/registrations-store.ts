import { Registration } from '@mic/shared-types';
import { DEMO_REGISTRATIONS } from './mock-data';

// Persistent in-memory store for Next.js runtime
declare global {
  var __MIC_REGISTRATIONS__: Registration[] | undefined;
  var __MIC_SUPER_ADMIN_PASSWORD__: string | undefined;
  var __MIC_USER_PASSWORDS__: Record<string, string> | undefined;
  var __MIC_RESET_CODES__: Record<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.__MIC_REGISTRATIONS__) {
  global.__MIC_REGISTRATIONS__ = [...DEMO_REGISTRATIONS];
}

if (!global.__MIC_SUPER_ADMIN_PASSWORD__) {
  global.__MIC_SUPER_ADMIN_PASSWORD__ = 'password123';
}

if (!global.__MIC_USER_PASSWORDS__) {
  global.__MIC_USER_PASSWORDS__ = {
    'myshaibnatchowdhury@gmail.com': 'password123',
    'student@mic-university.edu.bd': 'password123',
    'tanvir.student@gmail.com': 'password123',
    'sadia.islam2026@gmail.com': 'password123',
    'farhan.kabir@yahoo.com': 'password123',
    'teacher@mic-university.edu.bd': 'password123',
    'admin@mic-university.edu.bd': 'password123',
    'parent@mic-university.edu.bd': 'password123',
  };
}

if (!global.__MIC_RESET_CODES__) {
  global.__MIC_RESET_CODES__ = {};
}

export function savePasswordResetCode(email: string, code: string): void {
  const cleanEmail = email.trim().toLowerCase();
  if (!global.__MIC_RESET_CODES__) {
    global.__MIC_RESET_CODES__ = {};
  }
  global.__MIC_RESET_CODES__[cleanEmail] = {
    code: code.trim(),
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
  };
}

export function getPasswordResetCode(email: string): string | null {
  const cleanEmail = email.trim().toLowerCase();
  const entry = (global.__MIC_RESET_CODES__ || {})[cleanEmail];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) return null;
  return entry.code;
}

export function verifyPasswordResetCode(email: string, code: string): { valid: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const entry = (global.__MIC_RESET_CODES__ || {})[cleanEmail];
  if (!entry) {
    return { valid: false, error: 'No verification code requested or code has expired. Please request a new code.' };
  }
  if (Date.now() > entry.expiresAt) {
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }
  if (entry.code.trim() !== code.trim()) {
    return { valid: false, error: 'Invalid verification code. Please check your email.' };
  }
  return { valid: true };
}

export function setUserPassword(email: string, password: string): void {
  const cleanEmail = email.trim().toLowerCase();
  if (!global.__MIC_USER_PASSWORDS__) {
    global.__MIC_USER_PASSWORDS__ = {};
  }
  global.__MIC_USER_PASSWORDS__[cleanEmail] = password.trim();
  if (cleanEmail === 'myshaibnatchowdhury@gmail.com') {
    global.__MIC_SUPER_ADMIN_PASSWORD__ = password.trim();
  }
}

export function verifyUserPassword(email: string, password: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const inputPass = password.trim();

  if (cleanEmail === 'myshaibnatchowdhury@gmail.com') {
    const adminPass = getSuperAdminPassword();
    if (inputPass === adminPass) return true;
    if (inputPass === 'password123') return true; // Default fallback
  }

  const passwords = global.__MIC_USER_PASSWORDS__ || {};
  if (passwords[cleanEmail]) {
    if (passwords[cleanEmail] === inputPass) return true;
  }

  // Also check if user is in registrations store
  const reg = (global.__MIC_REGISTRATIONS__ ?? []).find(r => r.email.trim().toLowerCase() === cleanEmail);
  if (reg) {
    // If registered without explicit custom password, default password123 applies
    return inputPass === 'password123';
  }

  return false;
}

export function getUserRole(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'myshaibnatchowdhury@gmail.com') return 'super_admin';
  if (cleanEmail === 'admin@mic-university.edu.bd') return 'institution_admin';
  if (cleanEmail === 'teacher@mic-university.edu.bd') return 'teacher';
  if (cleanEmail === 'parent@mic-university.edu.bd') return 'parent';

  const reg = (global.__MIC_REGISTRATIONS__ ?? []).find(r => r.email.trim().toLowerCase() === cleanEmail);
  if (reg && reg.role) return reg.role;

  return 'student';
}

export function getAllRegistrations(): Registration[] {
  return global.__MIC_REGISTRATIONS__ ?? [];
}

export function addRegistration(reg: Omit<Registration, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: 'pending' | 'approved' | 'rejected' }): Registration {
  const newReg: Registration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    full_name: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    institution_name: reg.institution_name || 'MIC Smart University',
    institution_id: reg.institution_id || 'a0000000-0000-0000-0000-000000000001',
    role: reg.role,
    source: reg.source || 'mobile_apk',
    status: reg.status || 'pending',
    notes: reg.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  global.__MIC_REGISTRATIONS__ = [newReg, ...(global.__MIC_REGISTRATIONS__ ?? [])];
  return newReg;
}

export function updateRegistrationStatus(id: string, status: 'approved' | 'rejected'): Registration | null {
  const list = global.__MIC_REGISTRATIONS__ ?? [];
  const index = list.findIndex(r => r.id === id);
  if (index === -1) return null;

  const updated: Registration = {
    ...list[index],
    status,
    updated_at: new Date().toISOString(),
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'Mysha Ibnat Chowdhury (Super Admin)'
  };

  list[index] = updated;
  global.__MIC_REGISTRATIONS__ = list;
  return updated;
}

export function getSuperAdminPassword(): string {
  return global.__MIC_SUPER_ADMIN_PASSWORD__ ?? 'password123';
}

export function setSuperAdminPassword(newPass: string): void {
  global.__MIC_SUPER_ADMIN_PASSWORD__ = newPass.trim();
  if (!global.__MIC_USER_PASSWORDS__) global.__MIC_USER_PASSWORDS__ = {};
  global.__MIC_USER_PASSWORDS__['myshaibnatchowdhury@gmail.com'] = newPass.trim();
}

export function getStudentProfileByEmail(email: string) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const reg = (global.__MIC_REGISTRATIONS__ ?? []).find(r => r.email.trim().toLowerCase() === cleanEmail);

  if (reg) {
    const nameParts = reg.full_name.trim().split(' ');
    const firstName = nameParts[0] || 'Student';
    const lastName = nameParts.slice(1).join(' ') || '';

    let program = 'Computer Science & Engineering';
    if (reg.notes && reg.notes.includes('Program/Class:')) {
      const match = reg.notes.match(/Program\/Class:\s*([^,]+)/);
      if (match && match[1]) program = match[1].trim();
    } else if (reg.notes && reg.notes.includes('Program:')) {
      const match = reg.notes.match(/Program:\s*([^,]+)/);
      if (match && match[1]) program = match[1].trim();
    }

    const codeNum = Math.abs(cleanEmail.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000)) % 9000 + 1000;

    return {
      id: reg.id,
      student_id_code: `MIC-2026-${codeNum}`,
      first_name: firstName,
      last_name: lastName,
      full_name: reg.full_name,
      email: reg.email,
      phone: reg.phone,
      institution_name: reg.institution_name || 'MIC Smart University',
      class_name: program,
      section_name: 'Section A (Admitted Student)',
      status: reg.status,
      attendance_percentage: reg.status === 'approved' ? 98.2 : 96.0,
      current_gpa: reg.status === 'approved' ? 3.92 : 3.85,
      blood_group: 'B+',
      notes: reg.notes
    };
  }

  // Fallback demo for student@mic-university.edu.bd
  if (cleanEmail === 'student@mic-university.edu.bd') {
    return {
      id: 's0000000-0000-0000-0000-000000000001',
      student_id_code: 'MIC-2026-0042',
      first_name: 'Samiul',
      last_name: 'Haque',
      full_name: 'Samiul Haque',
      email: 'student@mic-university.edu.bd',
      phone: '+8801700000001',
      institution_name: 'MIC Smart University',
      class_name: 'B.Sc in Computer Science & Engineering',
      section_name: 'Section A (Batch 2026)',
      status: 'approved',
      attendance_percentage: 95.8,
      current_gpa: 3.88,
      blood_group: 'A+',
      notes: 'Active enrolled student with merit scholarship'
    };
  }

  return null;
}
