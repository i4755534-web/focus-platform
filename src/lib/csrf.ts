import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'your-super-secret-csrf-key-change-this-in-production';

// Generate CSRF token
export function generateCsrfToken(sessionId?: string): string {
  const payload = sessionId || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');
  return `${payload}.${hash}`;
}

// Validate CSRF token
export function validateCsrfToken(token: string, sessionId?: string): boolean {
  if (!token) return false;

  const [payload, hash] = token.split('.');
  if (!payload || !hash) return false;

  const expectedHash = crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

// Middleware helper for API routes
export async function validateCsrf(request: Request, sessionId?: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const token = request.headers.get('x-csrf-token') || request.headers.get('csrf-token');

    if (!token) {
      return { valid: false, error: 'CSRF token missing' };
    }

    const isValid = validateCsrfToken(token, sessionId);
    if (!isValid) {
      return { valid: false, error: 'Invalid CSRF token' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'CSRF validation failed' };
  }
}

// Get CSRF token for client-side usage
export function getCsrfToken(sessionId?: string): string {
  return generateCsrfToken(sessionId);
}