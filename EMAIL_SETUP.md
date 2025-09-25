# Email Setup Guide

This guide will help you set up email functionality for password reset in your Global International application.

## Prerequisites

- Node.js and npm installed
- An email service provider (Gmail, SendGrid, etc.)

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@globalinternational.com

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=3600000
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Update your `.env.local`**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-gmail@gmail.com
   ```

## SendGrid Setup (Recommended for Production)

1. **Create a SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Create an API Key**:
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Update your `.env.local`**:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@yourdomain.com
   ```

## Other Email Providers

### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail

```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Testing the Email Functionality

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Test the forgot password flow**:
   - Go to `/forgot-password`
   - Enter a valid email address
   - Check your email for the reset link

3. **Check the console logs** for any email sending errors

## Troubleshooting

### Common Issues

1. **"Invalid login" error**:
   - Make sure you're using an App Password for Gmail (not your regular password)
   - Verify 2FA is enabled on your Gmail account

2. **"Connection timeout" error**:
   - Check your SMTP_HOST and SMTP_PORT settings
   - Ensure your firewall allows outbound connections on port 587

3. **"Authentication failed" error**:
   - Verify your SMTP_USER and SMTP_PASS are correct
   - For Gmail, make sure you're using an App Password

4. **Emails not being received**:
   - Check your spam/junk folder
   - Verify the SMTP_FROM address is valid
   - Check the console logs for sending errors

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
DEBUG=nodemailer:*
```

## Production Considerations

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Set up proper DNS records** (SPF, DKIM, DMARC) for better deliverability
3. **Monitor email delivery rates** and bounce handling
4. **Implement proper error handling** and retry logic
5. **Use environment-specific configurations** for different deployment stages

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique passwords for email accounts
- Regularly rotate API keys and passwords
- Monitor for suspicious email sending activity
- Implement proper rate limiting to prevent abuse

## API Endpoints

The following API endpoints are available:

- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-reset-token` - Verify reset token validity

## Rate Limiting

The system includes built-in rate limiting:

- Default: 5 requests per hour per IP address
- Configurable via environment variables
- Returns 429 status with retry information when exceeded
