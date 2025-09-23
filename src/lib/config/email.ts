// Email configuration
export const emailConfig = {
  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  
  // Email settings
  from: {
    name: 'Global International',
    address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@globalinternational.com',
  },
  
  // App settings
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Rate limiting
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  },
};

// Validate email configuration
export function validateEmailConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!emailConfig.smtp.auth.user) {
    errors.push('SMTP_USER is required');
  }
  
  if (!emailConfig.smtp.auth.pass) {
    errors.push('SMTP_PASS is required');
  }
  
  if (!emailConfig.smtp.host) {
    errors.push('SMTP_HOST is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
