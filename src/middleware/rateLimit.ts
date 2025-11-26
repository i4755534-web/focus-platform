import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (in production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Helper function to get client IP
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback for development
  return '127.0.0.1';
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
  skip?: (req: NextRequest) => boolean;
  handler?: (req: NextRequest, res: NextResponse) => NextResponse;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      ...config,
    };
  }

  middleware(req: NextRequest): NextResponse | null {
    // Skip rate limiting if configured
    if (this.config.skip?.(req)) {
      return null;
    }

    // Generate key for rate limiting
    const key = this.config.keyGenerator?.(req) ||
                `${getClientIP(req)}:${req.nextUrl.pathname}`;

    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get current entry
    let entry = rateLimitStore.get(key);

    // Clean up expired entries
    if (!entry || entry.resetTime < windowStart) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      const resetTime = new Date(entry.resetTime);
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      const response = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter,
          resetTime: resetTime.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': this.config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString(),
          },
        }
      );

      return this.config.handler?.(req, response) || response;
    }

    // Update counter
    entry.count++;
    rateLimitStore.set(key, entry);

    // Add rate limit headers to successful requests
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    const resetTime = new Date(entry.resetTime);

    return new NextResponse(null, {
      headers: {
        'X-RateLimit-Limit': this.config.maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toISOString(),
      },
    });
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per 15 minutes
  keyGenerator: (req) => `${getClientIP(req)}:${req.nextUrl.pathname}`,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.nextUrl.pathname === '/api/health';
  },
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (req) => `${getClientIP(req)}:auth`,
  skip: (req) => {
    // Skip rate limiting for registration
    return req.nextUrl.pathname === '/api/auth/register';
  },
});

export const fileUploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50, // 50 uploads per hour
  keyGenerator: (req) => `${getClientIP(req)}:upload`,
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
  keyGenerator: (req) => `${getClientIP(req)}:search`,
});

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute