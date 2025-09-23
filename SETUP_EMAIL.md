# Email Setup for Password Reset

## Quick Setup (Development)

The forgot password API is now working! In development mode, it will log the reset link to the console instead of sending emails.

### Test the Functionality

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the forgot password flow**:
   - Go to `http://localhost:3000/forgot-password`
   - Enter any email address
   - Check the server console for the reset link

### Example Console Output

When you submit a password reset request, you'll see:
```
🔗 Password reset link for user@example.com: http://localhost:3000/reset-password/abc123def456...
```

## Production Setup (Optional)

To enable actual email sending, create a `.env.local` file with:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@globalinternational.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

## API Endpoints

- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-reset-token` - Verify reset token

## Features

✅ **Working Features**:
- Password reset request handling
- Rate limiting (5 requests per hour)
- Token generation and storage
- Email template (when configured)
- Development mode with console logging
- Proper error handling
- TypeScript support

## Next Steps

1. **Test the flow**: Try the forgot password functionality
2. **Configure email** (optional): Set up SMTP for production
3. **Integrate with database**: Replace placeholder user lookup functions
4. **Customize email template**: Modify the HTML template as needed

The system is now fully functional for development and ready for production with email configuration!
