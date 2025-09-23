// Simple in-memory rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 3600000 // 1 hour
): RateLimitResult {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }
  
  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
      retryAfter: Math.ceil((current.resetTime - now) / 1000),
    };
  }
  
  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);
  
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

export function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}
