'use server';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendVerificationStatusEmail(
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
) {
  try {
    // TEMPORARY: Use your verified email for Resend testing
    const testEmail = 'ahmed.salem1997@gmail.com';
    
    const emailData: EmailData = {
      to: testEmail, // Temporarily using your verified email
      subject: status === 'approved' 
        ? '🎉 Account Verification Approved - Dragos Capital'
        : 'Account Verification Update - Dragos Capital',
      html: await getEmailTemplate(status, userName, rejectionReason)
    };
    
    console.log(`📧 TESTING: Sending to ${testEmail} instead of ${userEmail}`);

    console.log('📧 Sending email via Resend:', { to: emailData.to, subject: emailData.subject });
    console.log('🔑 Using API key:', process.env.RESEND_API_KEY ? 'Found' : 'Missing');
    
    // Send email using Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: 'Dragos Capital <onboarding@resend.dev>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });
    
    console.log('📤 Resend API response:', result);
    
    if (result.error) {
      console.error('❌ Resend error details:', result.error);
      throw new Error(`Resend error: ${result.error.message || JSON.stringify(result.error)}`);
    }
    
    console.log('✅ Email sent successfully:', result.data?.id);
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function getEmailTemplate(
  status: 'approved' | 'rejected',
  userName: string,
  rejectionReason?: string
): Promise<string> {
  try {
    const templatePath = join(
      process.cwd(), 
      'supabase', 
      'templates', 
      status === 'approved' ? 'verification-approved.html' : 'verification-rejected.html'
    );
    
    let template = await readFile(templatePath, 'utf-8');
    
    // Replace template variables
    template = template.replace(/\{\{\s*\.SiteURL\s*\}\}/g, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    template = template.replace(/\{\{\s*\.UserName\s*\}\}/g, userName);
    
    if (status === 'rejected' && rejectionReason) {
      template = template.replace(/\{\{\s*\.RejectionReason\s*\}\}/g, rejectionReason);
    }
    
    return template;
  } catch (error) {
    console.error('Failed to load email template:', error);
    return generateFallbackHTML(userName, status, rejectionReason);
  }
}

function generateFallbackHTML(
  userName: string, 
  status: 'approved' | 'rejected', 
  rejectionReason?: string
): string {
  if (status === 'approved') {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #22c55e; font-size: 24px; margin-bottom: 20px;">🎉 Account Verification Approved!</h1>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 16px 0; font-size: 16px;">
            Congratulations ${userName}! Your account verification has been approved.
          </p>
          
          <p style="margin: 0 0 16px 0; font-size: 16px;">You now have full access to:</p>
          
          <ul style="margin: 16px 0; padding-left: 20px;">
            <li>Market data and analysis</li>
            <li>Stock screener tools</li>
            <li>Wallet and withdrawal management</li>
            <li>All premium features</li>
          </ul>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/home" 
               style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Access Your Dashboard
            </a>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">Dragos Capital</p>
      </div>
    `;
  } else {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ef4444; font-size: 24px; margin-bottom: 20px;">Account Verification Update</h1>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 16px 0; font-size: 16px;">
            Hello ${userName}, we've reviewed your verification request.
          </p>
          
          <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
            Reason: ${rejectionReason || 'Please review and resubmit your verification documents.'}
          </p>
          
          <p style="margin: 0 0 16px 0; font-size: 16px;">
            Please address the issues mentioned above and submit a new verification request.
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/home/verify" 
               style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Resubmit Verification
            </a>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">Dragos Capital</p>
      </div>
    `;
  }
}