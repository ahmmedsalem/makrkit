import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { sendVerificationStatusEmail } from '@kit/accounts/server/send-verification-email';

export async function POST(request: NextRequest) {
  try {
    const { userId, status, rejectionReason } = await request.json();
    
    console.log('📧 Email API called with:', { userId, status, rejectionReason });
    
    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create admin client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    console.log('🔍 Looking for account with ID:', userId);
    
    const { data: account, error } = await supabase
      .from('accounts')
      .select('email, name')
      .eq('id', userId)
      .single();

    console.log('📊 Supabase query result:', { account, error });

    if (error || !account?.email) {
      console.log('❌ User not found or missing email:', { error: error?.message, account });
      return NextResponse.json({ error: 'User not found or no email' }, { status: 404 });
    }

    // Send email
    const result = await sendVerificationStatusEmail(
      account.email,
      account.name || account.email,
      status,
      rejectionReason
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}