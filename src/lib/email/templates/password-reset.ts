export function renderPasswordResetEmail(
  resetUrl: string,
  email: string
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #0d9488;
          margin-top: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content p {
          margin-bottom: 20px;
          font-size: 16px;
          color: #4b5563;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s ease;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .security-notice {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .security-notice h3 {
          color: #92400e;
          margin-top: 0;
          font-size: 18px;
        }
        .security-notice p {
          color: #92400e;
          margin-bottom: 0;
          font-size: 14px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .footer a {
          color: #0d9488;
          text-decoration: none;
        }
        .link-fallback {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          word-break: break-all;
          font-size: 14px;
          color: #374151;
        }
        .link-fallback strong {
          color: #111827;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Global International</h1>
        </div>
        
        <div class="content">
          <h2>Reset Your Password</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset the password for your Global International account associated with <strong>${email}</strong>.</p>
          
          <p>If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          
          <div class="security-notice">
            <h3>🔒 Security Notice</h3>
            <p>This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          
          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
          
          <div class="link-fallback">
            <strong>Reset Link:</strong><br>
            ${resetUrl}
          </div>
          
          <p>If you have any questions or need assistance, please contact our support team.</p>
          
          <p>Best regards,<br>
          The Global International Team</p>
        </div>
        
        <div class="footer">
          <p><strong>Global International</strong></p>
          <p>Premium Hospitality Products</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Visit our website</a> | 
            <a href="mailto:support@globalinternational.com">Contact Support</a>
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            This email was sent to ${email}. If you didn't request this password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
