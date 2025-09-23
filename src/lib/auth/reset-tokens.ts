import crypto from 'crypto';

// In-memory storage for reset tokens (in production, use Redis or database)
const resetTokens = new Map<string, { token: string; expiresAt: number; email: string }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of resetTokens.entries()) {
    if (value.expiresAt < now) {
      resetTokens.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Generate a secure reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Store a reset token with expiration
 */
export async function storeResetToken(
  email: string,
  token: string,
  expiresInSeconds: number = 3600
): Promise<void> {
  const expiresAt = Date.now() + (expiresInSeconds * 1000);
  
  // Remove any existing tokens for this email
  for (const [key, value] of resetTokens.entries()) {
    if (value.email === email) {
      resetTokens.delete(key);
    }
  }
  
  // Store the new token
  resetTokens.set(token, {
    token,
    expiresAt,
    email,
  });
}

/**
 * Verify and consume a reset token
 */
export async function verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return { valid: false };
  }
  
  if (tokenData.expiresAt < Date.now()) {
    resetTokens.delete(token);
    return { valid: false };
  }
  
  return { valid: true, email: tokenData.email };
}

/**
 * Consume (delete) a reset token after successful use
 */
export async function consumeResetToken(token: string): Promise<boolean> {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return false;
  }
  
  resetTokens.delete(token);
  return true;
}

/**
 * Get all active reset tokens (for debugging/admin purposes)
 */
export function getActiveResetTokens(): Array<{ email: string; expiresAt: number }> {
  const now = Date.now();
  return Array.from(resetTokens.values())
    .filter(token => token.expiresAt > now)
    .map(token => ({
      email: token.email,
      expiresAt: token.expiresAt,
    }));
}
