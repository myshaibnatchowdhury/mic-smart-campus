import { NextRequest, NextResponse } from 'next/server';
import { getSuperAdminPassword, setSuperAdminPassword } from '@/lib/registrations-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    success: true,
    email: 'myshaibnatchowdhury@gmail.com',
    password: getSuperAdminPassword()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify Super Admin Password Check
    if (body.action === 'verify') {
      const currentSaved = getSuperAdminPassword();
      const valid = body.password === currentSaved;
      return NextResponse.json({
        success: true,
        valid,
        email: 'myshaibnatchowdhury@gmail.com'
      });
    }

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation do not match' },
        { status: 400 }
      );
    }

    const currentSaved = getSuperAdminPassword();
    if (currentPassword && currentPassword !== currentSaved) {
      return NextResponse.json(
        { success: false, error: 'Current password does not match records' },
        { status: 401 }
      );
    }

    // Try Supabase auth update if user is authenticated
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch (e) {
        // Continue with local persistent store update
      }
    }

    // Update persistent store
    setSuperAdminPassword(newPassword);

    return NextResponse.json({
      success: true,
      message: 'Password successfully changed for Super Admin Mysha Ibnat Chowdhury!'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}
