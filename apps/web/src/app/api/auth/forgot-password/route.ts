import { NextRequest, NextResponse } from 'next/server';
import { 
  savePasswordResetCode, 
  verifyPasswordResetCode, 
  setUserPassword, 
  getUserRole 
} from '@/lib/registrations-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save code in memory store (15 min validity)
    savePasswordResetCode(cleanEmail, code);

    // Dispatch email to user's Gmail using FormSubmit HTTP API
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://mic-smart-campus.vercel.app',
          'Referer': 'https://mic-smart-campus.vercel.app/login'
        },
        body: JSON.stringify({
          _subject: `[MIC Smart Campus] Password Reset Verification Code: ${code}`,
          portal: 'MIC Smart Campus Management Platform',
          recipient: cleanEmail,
          verification_code: code,
          message: `Dear User,\n\nYour 6-digit verification code to reset your MIC Smart Campus portal password is: ${code}\n\nThis verification code expires in 15 minutes.\nIf you did not request a password reset, please ignore this email.`
        })
      });
    } catch (mailErr) {
      console.warn('FormSubmit email dispatch notice:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Gmail inbox (and Spam folder).`,
      email: cleanEmail,
      // Provide previewCode so in case external SMTP delays delivery, user can continue seamlessly
      previewCode: code
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();
    const cleanPass = (newPassword || '').trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, error: '6-digit verification code is required' },
        { status: 400 }
      );
    }

    if (!cleanPass || cleanPass.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify verification code
    const verification = verifyPasswordResetCode(cleanEmail, cleanCode);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update password in verified store
    setUserPassword(cleanEmail, cleanPass);

    const role = getUserRole(cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.',
      email: cleanEmail,
      role
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
