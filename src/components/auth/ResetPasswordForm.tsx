'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { authApi } from '@/lib/api/auth';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.resetPassword({
        token: data.token,
        password: data.password,
      });

      if (response.success) {
        setSuccess(true);
        // Navigate to login page with success parameter after a short delay
        setTimeout(() => {
          router.push('/login?reset=success');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      
      // Handle specific token-related errors
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        setError('This password reset link is invalid or has expired. Please request a new password reset.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state
  if (success) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your password has been successfully reset. You will be redirected to the login page shortly.
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="error">
            <div>
              <span>{error}</span>
              {error.includes('invalid') || error.includes('expired') ? (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm underline hover:no-underline"
                  >
                    Request a new password reset
                  </button>
                </div>
              ) : null}
            </div>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-stone-600 hover:text-stone-800"
              >
                {showPassword ? 'Hide' : 'Show'} password
              </button>
            </div>
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-sm text-stone-600 hover:text-stone-800"
              >
                {showConfirmPassword ? 'Hide' : 'Show'} password
              </button>
            </div>
          </div>
        </div>

        {/* Password requirements */}
        <div className="bg-stone-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-stone-900 mb-2">
            Password Requirements:
          </h4>
          <ul className="text-sm text-stone-600 space-y-1">
            <li className={`flex items-center ${password && password.length >= 8 ? 'text-green-600' : ''}`}>
              <span className="mr-2">•</span>
              At least 8 characters long
            </li>
            <li className={`flex items-center ${password && /[a-z]/.test(password) ? 'text-green-600' : ''}`}>
              <span className="mr-2">•</span>
              Contains at least one lowercase letter
            </li>
            <li className={`flex items-center ${password && /[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
              <span className="mr-2">•</span>
              Contains at least one uppercase letter
            </li>
            <li className={`flex items-center ${password && /\d/.test(password) ? 'text-green-600' : ''}`}>
              <span className="mr-2">•</span>
              Contains at least one number
            </li>
            <li className={`flex items-center ${password && /[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}`}>
              <span className="mr-2">•</span>
              Contains at least one special character
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="inline-flex items-center text-sm text-stone-600 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
