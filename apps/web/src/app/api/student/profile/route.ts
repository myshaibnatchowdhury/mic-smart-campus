import { NextRequest, NextResponse } from 'next/server';
import { getStudentProfileByEmail } from '@/lib/registrations-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'student@mic-university.edu.bd';
    const profile = getStudentProfileByEmail(email);

    return NextResponse.json({
      success: true,
      student: profile
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch student profile' },
      { status: 500 }
    );
  }
}
