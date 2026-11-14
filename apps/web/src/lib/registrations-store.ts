import { Registration } from '@mic/shared-types';
import { DEMO_REGISTRATIONS } from './mock-data';

// Persistent in-memory store for Next.js runtime
declare global {
  var __MIC_REGISTRATIONS__: Registration[] | undefined;
  var __MIC_SUPER_ADMIN_PASSWORD__: string | undefined;
  var __MIC_USER_PASSWORDS__: Record<string, string> | undefined;
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

export function setUserPassword(email: string, password: string): void {
  const cleanEmail = email.trim().toLowerCase();
  if (!global.__MIC_USER_PASSWORDS__) {
    global.__MIC_USER_PASSWORDS__ = {};
  }
  global.__MIC_USER_PASSWORDS__[cleanEmail] = password;
}

export function verifyUserPassword(email: string, password: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'myshaibnatchowdhury@gmail.com') {
    const adminPass = getSuperAdminPassword();
    return password.trim() === adminPass;
  }

  const passwords = global.__MIC_USER_PASSWORDS__ || {};
  if (passwords[cleanEmail]) {
    return passwords[cleanEmail] === password.trim();
  }

  // Also check if user is in registrations store
  const reg = (global.__MIC_REGISTRATIONS__ ?? []).find(r => r.email.trim().toLowerCase() === cleanEmail);
  if (reg) {
    // If registered without explicit custom password, default password123 applies
    return password.trim() === 'password123';
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
  global.__MIC_SUPER_ADMIN_PASSWORD__ = newPass;
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

  if (cleanEmail === 'student@mic-university.edu.bd') {
    return {
      id: 'st-samiul-001',
      student_id_code: 'MIC-2026-0842',
      first_name: 'Samiul',
      last_name: 'Karim',
      full_name: 'Samiul Karim',
      email: 'student@mic-university.edu.bd',
      phone: '+880 1712-345678',
      institution_name: 'MIC Smart University',
      class_name: 'Computer Science & Engineering',
      section_name: 'Section A',
      status: 'approved',
      attendance_percentage: 96.2,
      current_gpa: 3.88,
      blood_group: 'B+'
    };
  }

  // Any other email
  const namePart = cleanEmail.split('@')[0] || 'student';
  const parts = namePart.split(/[\._\-]/).filter(Boolean);
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Student';
  const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'User';
  const codeNum = Math.abs(cleanEmail.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000)) % 9000 + 1000;

  return {
    id: `st-${codeNum}`,
    student_id_code: `MIC-2026-${codeNum}`,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    email: cleanEmail,
    phone: '+880 1712-345678',
    institution_name: 'MIC Smart University',
    class_name: 'Computer Science & Engineering',
    section_name: 'Admitted Student Section',
    status: 'approved',
    attendance_percentage: 95.5,
    current_gpa: 3.80,
    blood_group: 'A+'
  };
}
