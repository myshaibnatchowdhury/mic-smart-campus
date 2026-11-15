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

    // Special handling for Super Admin: Mysha Ibnat Chowdhury
    if (cleanEmail === 'myshaibnatchowdhury@gmail.com') {
      let isMatch = false;

      // 1. Check custom password saved in Supabase PostgreSQL
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('national_id')
            .eq('email', cleanEmail)
            .single();

          if (data && data.national_id && data.national_id.trim()) {
            if (cleanPassword === data.national_id.trim()) {
              isMatch = true;
            }
          }
        } catch (_) {}
      }

      // 2. Default passwords for Super Admin: admin123 or password123 or in-memory password
      if (
        cleanPassword === 'admin123' ||
        cleanPassword === 'password123' ||
        verifyUserPassword(cleanEmail, cleanPassword)
      ) {
        isMatch = true;
      }

      if (isMatch) {
        return NextResponse.json({
          success: true,
          email: cleanEmail,
          role: 'super_admin',
          source: 'super_admin_verified'
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'ভুল পাসওয়ার্ড। আপনার ডিফল্ট পাসওয়ার্ড: admin123 (অথবা password123)' 
        },
        { status: 401 }
      );
    }

    // Attempt Supabase Auth for other accounts if configured
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

    // Default password check for other roles
    const isValid = 
      cleanPassword === 'admin123' || 
      cleanPassword === 'password123' || 
      verifyUserPassword(cleanEmail, cleanPassword);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'ভুল পাসওয়ার্ড বা ইমেইল। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।' },
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
