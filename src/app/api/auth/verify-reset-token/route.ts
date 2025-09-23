import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyResetToken } from '@/lib/auth/reset-tokens';

// Validation schema for token verification
const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifyTokenSchema.parse(body);

    // Verify the reset token
    const tokenVerification = await verifyResetToken(token);
    
    if (!tokenVerification.valid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired reset token',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reset token is valid',
      data: {
        email: tokenVerification.email,
      },
    });

  } catch (error) {
    console.error('Verify reset token error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token format',
        errors: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred while verifying the reset token',
    }, { status: 500 });
  }
}
