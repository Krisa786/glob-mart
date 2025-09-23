// Development configuration
export const developmentConfig = {
  // Email configuration for development
  email: {
    enabled: process.env.NODE_ENV === 'production' || (process.env.SMTP_USER && process.env.SMTP_PASS),
    logResetLinks: process.env.NODE_ENV === 'development' && !process.env.SMTP_USER,
  },
  
  // API configuration
  api: {
    logRequests: process.env.NODE_ENV === 'development',
    logErrors: true,
  },
};

// Check if email is properly configured
export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

// Get development status
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
