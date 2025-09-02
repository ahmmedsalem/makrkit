// Test Resend API key directly
const { Resend } = require('resend');

async function testResend() {
  console.log('🧪 Testing Resend API key...');
  
  const resend = new Resend('re_jVRzad4i_CG4JPZsbHCpzyFG1NPVGsMPo');
  
  try {
    const result = await resend.emails.send({
      from: 'Dragos Capital <noreply@dragoscapital.com>',
      to: 'your-email@example.com', // Replace with your email
      subject: '🧪 Test Email from Dragos Capital',
      html: '<h1>Test Email</h1><p>If you receive this, Resend is working!</p>',
    });
    
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Resend error:', error);
  }
}

testResend();