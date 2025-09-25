import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email/password-reset';
import { generateResetToken, storeResetToken } from '@/lib/auth/reset-tokens';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { emailConfig } from '@/lib/config/email';
import { isEmailConfigured, isDevelopment } from '@/lib/config/development';

// Validation schema for forgot password request
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimitKey = getRateLimitKey(ip, 'forgot-password');

    // Check rate limit
    const rateLimit = checkRateLimit(
      rateLimitKey,
      emailConfig.rateLimit.maxRequests,
      emailConfig.rateLimit.windowMs
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many password reset requests, please try again',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists (you might want to integrate with your user database)
    // For now, we'll always send an email for security reasons
    const userExists = await checkUserExists(email);

    if (userExists) {
      // Generate reset token
      const resetToken = generateResetToken();

      // Store reset token with expiration (1 hour)
      await storeResetToken(email, resetToken, 3600); // 1 hour in seconds

      // Check if email configuration is available
      if (isEmailConfigured()) {
        // Send password reset email
        await sendPasswordResetEmail(email, resetToken);
      } else if (isDevelopment()) {
        // In development mode without email config, log the reset link
        // In development mode, log the reset link for testing
        // console.log(`🔗 Password reset link for ${email}: ${emailConfig.appUrl}/reset-password/${resetToken}`);
      } else {
        // In production without email config, this is an error
        throw new Error('Email configuration is required in production');
      }
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message:
        "If an account with this email exists, we've sent you a password reset link.",
    });
  } catch (error) {
    // Log error for debugging
    // console.error('Forgot password error:', error);
    // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
          errors: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle rate limiting
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many password reset requests, please try again',
          retryAfter: 3600, // 1 hour
        },
        { status: 429 }
      );
    }

    // Return more detailed error information in development
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json(
      {
        success: false,
        message: isDev
          ? errorMessage
          : 'An error occurred while processing your request',
        ...(isDev && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 }
    );
  }
}

// Placeholder function to check if user exists
// You should replace this with your actual user database query
async function checkUserExists(_email: string): Promise<boolean> {
  // TODO: Implement actual user lookup from your database
  // For now, return true to always send emails
  // Log for debugging
  // console.log(`Checking if user exists for email: ${_email}`);
  return true;
}
