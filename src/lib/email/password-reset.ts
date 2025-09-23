import nodemailer from 'nodemailer';
import { renderPasswordResetEmail } from './templates/password-reset';
import { emailConfig, validateEmailConfig } from '@/lib/config/email';
import { isEmailConfigured } from '@/lib/config/development';

// Validate email configuration
const configValidation = validateEmailConfig();
if (!configValidation.valid) {
  console.warn('Email configuration issues:', configValidation.errors);
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig.smtp);

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  try {
    // Check if email configuration is valid
    if (!isEmailConfigured()) {
      throw new Error('Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.');
    }

    const resetUrl = `${emailConfig.appUrl}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: 'Reset Your Password - Global International',
      html: renderPasswordResetEmail(resetUrl, email),
      text: `Reset your password by clicking the following link: ${resetUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
}
