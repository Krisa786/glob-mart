'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Clock } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { FormField } from '@/components/auth/FormField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { AuthAlert } from '@/components/auth/AuthAlert';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      setTimeLeft(retryAfter);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            setRetryAfter(null);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  // Reset rate limit when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      setRetryAfter(null);
      setTimeLeft(null);
    };
  }, []);

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setAlert(null);
    setRetryAfter(null);

    try {
      const response = await authApi.forgotPassword(data);

      if (response.success) {
        setIsSubmitted(true);
        setResetLink(response.data?.resetLink || null);
        setAlert({
          type: 'success',
          message:
            "If an account with this email exists, we've sent you a password reset link. Please check your email and follow the instructions.",
        });
      } else {
        // Handle API error response
        const errorMessage = response.message || 'An error occurred';
        
        // Check if it's a rate limiting error (429)
        if (errorMessage.toLowerCase().includes('too many') || 
            errorMessage.toLowerCase().includes('rate limit') ||
            errorMessage.toLowerCase().includes('429')) {
          
          // Try to extract retryAfter from the response if available
          const retryAfterSeconds = response.retryAfter || 3600; // Default to 1 hour
          setRetryAfter(retryAfterSeconds);
          
          const hours = Math.ceil(retryAfterSeconds / 3600);
          setAlert({
            type: 'error',
            message: `Too many password reset attempts. Please try again in ${hours} hour${hours > 1 ? 's' : ''}.`,
          });
        } else {
          // For other errors, show the same success message for security
          setIsSubmitted(true);
          setResetLink(response.data?.resetLink || null);
          setAlert({
            type: 'success',
            message:
              "If an account with this email exists, we've sent you a password reset link. Please check your email and follow the instructions.",
          });
        }
      }
    } catch (error: unknown) {
      // console.error('Forgot password error:', error);

      // Handle network or unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        setRetryAfter(3600); // Default to 1 hour
        setAlert({
          type: 'error',
          message: 'Too many password reset attempts. Please try again in 1 hour.',
        });
      } else {
        // For security, we show the same success message regardless of whether the email exists
        setIsSubmitted(true);
        setAlert({
          type: 'success',
          message:
            "If an account with this email exists, we've sent you a password reset link. Please check your email and follow the instructions.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'var(--color-background-primary)' }}
      >
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-teal-800">
              Check Your Email
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              We&apos;ve sent you a password reset link
            </p>
          </div>

          {/* Success Alert */}
          {alert && <AuthAlert type={alert.type} message={alert.message} />}

          {/* Reset Link Display */}
          {resetLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Reset Link Available
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      If you don't receive the email, you can use this direct link:
                    </p>
                    <div className="bg-white rounded border p-2 break-all">
                      <code className="text-xs text-blue-600">{resetLink}</code>
                    </div>
                    <button
                      onClick={() => window.open(resetLink, '_blank')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Open Reset Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div
            className="bg-white rounded-xl shadow-lg p-8"
            style={{ backgroundColor: 'var(--color-background-surface)' }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-medium text-stone-900 mb-2">
                  Next Steps
                </h2>
                <ol className="text-sm text-stone-600 space-y-2 text-left">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the password reset link in the email</li>
                  <li>3. Create a new password</li>
                  <li>4. Sign in with your new password</li>
                </ol>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <p className="text-sm text-stone-500 text-center">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setAlert(null);
                    }}
                    className="font-medium text-teal-600 hover:text-teal-700"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-stone-500 hover:text-stone-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-background-primary)' }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-teal-800">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Enter your email address and we&apos;ll send you a link to reset your
            password
          </p>
        </div>

        {/* Alert */}
        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Rate Limit Countdown */}
        {timeLeft && timeLeft > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Rate limit active
                </p>
                <p className="text-sm text-yellow-700">
                  Please wait {formatTime(timeLeft)} before trying again
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        <div
          className="bg-white rounded-xl shadow-lg p-8"
          style={{ backgroundColor: 'var(--color-background-surface)' }}
        >
          <AuthForm schema={forgotPasswordSchema} onSubmit={handleSubmit}>
            {(form) => (
              <>
                <div className="space-y-6">
                  <FormField
                    form={form}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={timeLeft !== null && timeLeft > 0}
                  />
                </div>

                <div className="mt-8">
                  <SubmitButton 
                    isLoading={isLoading}
                    disabled={timeLeft !== null && timeLeft > 0}
                  >
                    {timeLeft && timeLeft > 0 
                      ? `Try again in ${formatTime(timeLeft)}`
                      : 'Send Reset Link'
                    }
                  </SubmitButton>
                </div>
              </>
            )}
          </AuthForm>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
