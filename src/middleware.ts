import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter, authRateLimiter, fileUploadRateLimiter, searchRateLimiter } from './middleware/rateLimit';

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS || 'https://focus-platform.com'
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Apply rate limiting based on endpoint
  let rateLimitResponse: NextResponse | null = null;

  if (pathname.startsWith('/api/auth/')) {
    rateLimitResponse = authRateLimiter.middleware(request);
  } else if (pathname.startsWith('/api/search')) {
    rateLimitResponse = searchRateLimiter.middleware(request);
  } else if (pathname.startsWith('/api/upload') || pathname.startsWith('/api/files')) {
    rateLimitResponse = fileUploadRateLimiter.middleware(request);
  } else if (pathname.startsWith('/api/')) {
    rateLimitResponse = apiRateLimiter.middleware(request);
  }

  // If rate limit exceeded, return the rate limit response
  if (rateLimitResponse && rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  // Security checks
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Add rate limit headers if rate limiting was applied
  if (rateLimitResponse) {
    const rateLimitHeaders = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'];
    rateLimitHeaders.forEach(header => {
      const value = rateLimitResponse!.headers.get(header);
      if (value) {
        response.headers.set(header, value);
      }
    });
  }

  // Content Security Policy for dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.stripe.com wss://focus-websocket.herokuapp.com https://www.google-analytics.com",
        "frame-src 'self' https://js.stripe.com https://www.youtube.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    );
  }

  // HSTS for HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};