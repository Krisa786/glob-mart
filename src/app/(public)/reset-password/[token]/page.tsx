import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export const metadata: Metadata = {
  title: 'Reset Password - GlobeMart',
  description: 'Reset your password using the secure token from your email',
  robots: 'noindex, nofollow', // Password reset pages should not be indexed
};

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below to complete the reset process
          </p>
        </div>
        
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
