// Test script for email functionality
// Run this with: npx tsx src/lib/email/test-email.ts

import { sendPasswordResetEmail, verifyEmailConfig } from './password-reset';
import { generateResetToken } from '@/lib/auth/reset-tokens';

async function testEmailFunctionality() {
  console.log('🧪 Testing email functionality...\n');

  // Test 1: Verify email configuration
  console.log('1. Verifying email configuration...');
  const configValid = await verifyEmailConfig();
  if (!configValid) {
    console.error('❌ Email configuration is invalid. Please check your environment variables.');
    console.log('\nRequired environment variables:');
    console.log('- SMTP_HOST');
    console.log('- SMTP_PORT');
    console.log('- SMTP_USER');
    console.log('- SMTP_PASS');
    console.log('- SMTP_FROM (optional)');
    return;
  }
  console.log('✅ Email configuration is valid\n');

  // Test 2: Generate reset token
  console.log('2. Generating reset token...');
  const resetToken = generateResetToken();
  console.log(`✅ Reset token generated: ${resetToken.substring(0, 8)}...\n`);

  // Test 3: Send test email
  console.log('3. Sending test password reset email...');
  try {
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    await sendPasswordResetEmail(testEmail, resetToken);
    console.log(`✅ Test email sent successfully to ${testEmail}\n`);
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return;
  }

  console.log('🎉 All email tests passed!');
  console.log('\nNext steps:');
  console.log('1. Check your email inbox (and spam folder)');
  console.log('2. Click the reset link in the email');
  console.log('3. Test the password reset flow in your application');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailFunctionality().catch(console.error);
}

export { testEmailFunctionality };
