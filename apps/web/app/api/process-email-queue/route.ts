import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

import { sendVerificationStatusEmail } from '@kit/accounts/server/send-verification-email';

export async function POST(request: NextRequest) {
  try {
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
    
    // Get pending emails from queue
    const { data: emailQueue, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);
    
    if (error) {
      console.error('Failed to fetch email queue:', error);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }
    
    if (!emailQueue || emailQueue.length === 0) {
      return NextResponse.json({ message: 'No pending emails', processed: 0 });
    }
    
    let processed = 0;
    
    for (const email of emailQueue) {
      try {
        console.log(`📧 Processing email ${email.id} for ${email.recipient_email}`);
        
        // Determine status based on email type
        const status = email.email_type === 'verification_approved' ? 'approved' : 'rejected';
        const rejectionReason = email.metadata?.rejection_reason;
        
        // Send the email
        const result = await sendVerificationStatusEmail(
          email.recipient_email,
          email.recipient_name,
          status,
          rejectionReason
        );
        
        if (result.success) {
          // Mark as sent
          await supabase
            .from('email_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              last_attempt_at: new Date().toISOString(),
              attempts: email.attempts + 1
            })
            .eq('id', email.id);
          
          console.log(`✅ Email ${email.id} sent successfully`);
          processed++;
        } else {
          // Mark as failed
          await supabase
            .from('email_queue')
            .update({
              status: 'failed',
              last_attempt_at: new Date().toISOString(),
              attempts: email.attempts + 1,
              metadata: {
                ...email.metadata,
                error: result.error
              }
            })
            .eq('id', email.id);
          
          console.error(`❌ Failed to send email ${email.id}:`, result.error);
        }
      } catch (error) {
        console.error(`❌ Error processing email ${email.id}:`, error);
        
        // Mark as failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            last_attempt_at: new Date().toISOString(),
            attempts: email.attempts + 1,
            metadata: {
              ...email.metadata,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          })
          .eq('id', email.id);
      }
    }
    
    return NextResponse.json({
      message: `Processed ${processed} emails`,
      processed,
      total: emailQueue.length
    });
    
  } catch (error) {
    console.error('Email queue processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}