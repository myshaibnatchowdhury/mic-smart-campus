import { NextRequest, NextResponse } from 'next/server';
import { verifyUserPassword, getUserRole } from '@/lib/registrations-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!cleanPassword) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Attempt Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (!error && data.user) {
          const role = getUserRole(cleanEmail);
          return NextResponse.json({
            success: true,
            email: cleanEmail,
            role,
            source: 'supabase_auth'
          });
        }
      } catch (e) {
        // Fall back to verified application credentials store
      }
    }

    const isValid = verifyUserPassword(cleanEmail, cleanPassword);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const role = getUserRole(cleanEmail);

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      role,
      source: 'verified_store'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
