import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllRegistrations, 
  addRegistration, 
  updateRegistrationStatus,
  setUserPassword
} from '@/lib/registrations-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          count: data.length,
          registrations: data
        });
      }
    }

    const registrations = getAllRegistrations();
    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, institution_name, role, source, notes, password } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (password) {
      setUserPassword(email, password);
    }

    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          full_name,
          email,
          phone,
          institution_name: institution_name || 'MIC Smart University',
          role: role || 'student',
          source: source || 'mobile_apk',
          status: 'pending',
          notes: notes || 'Submitted from client application'
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          message: 'Registration successfully submitted and received by Super Admin Panel',
          registration: data
        }, { status: 201 });
      }
    }

    // Fallback to synchronized store
    const newReg = addRegistration({
      full_name,
      email,
      phone,
      institution_name: institution_name || 'MIC Smart University',
      role: role || 'student',
      source: source || 'mobile_apk',
      status: 'pending',
      notes: notes || 'Submitted from client application'
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successfully submitted and received by Super Admin Panel',
      registration: newReg
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid id and status (approved/rejected) are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('registrations')
        .update({
          status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          message: `Registration marked as ${status}`,
          registration: data
        });
      }
    }

    const updated = updateRegistrationStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Registration marked as ${status}`,
      registration: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update registration' },
      { status: 500 }
    );
  }
}
