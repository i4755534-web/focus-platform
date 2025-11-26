import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './database';
import type { User } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await db.getUserByEmail(email);
    if (!user) return null;

    // For demo purposes, accept any password for existing users
    // In production, check hashed password
    // const isValidPassword = await this.verifyPassword(password, user.password);
    // if (!isValidPassword) return null;

    return user;
  }

  static async registerUser(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
  }): Promise<User | null> {
    const existingUser = await db.getUserByEmail(userData.email);
    if (existingUser) return null;

    const hashedPassword = await this.hashPassword(userData.password);

    const user = await db.createUser({
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      role: 'user',
      status: 'online',
      lastSeen: new Date(),
      preferences: {
        theme: 'system',
        language: 'ru',
        notifications: true,
        soundEnabled: true,
      },
      stats: {
        messagesSent: 0,
        filesUploaded: 0,
        voiceMessages: 0,
        achievements: [],
        level: 1,
        xp: 0,
      },
    });

    return user;
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  static getUserFromRequest(request: Request): Promise<User | null> {
    const authHeader = request.headers.get('authorization');
    const token = this.extractTokenFromHeader(authHeader);

    if (!token) return Promise.resolve(null);

    const payload = this.verifyToken(token);
    if (!payload) return Promise.resolve(null);

    return db.getUser(payload.userId);
  }
}

// Rate limiting store (in-memory for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  private static WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static MAX_REQUESTS = 100; // per window

  static checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      const resetTime = now + this.WINDOW_MS;
      rateLimitStore.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: this.MAX_REQUESTS - 1, resetTime };
    }

    if (record.count >= this.MAX_REQUESTS) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: this.MAX_REQUESTS - record.count, resetTime: record.resetTime };
  }

  static getRemainingTime(identifier: string): number {
    const record = rateLimitStore.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Security middleware
export class SecurityMiddleware {
  static corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  static securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  static async handleRequest(request: Request): Promise<{ allowed: boolean; user?: User; error?: string }> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return { allowed: true };
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    const rateLimit = RateLimiter.checkLimit(clientIP);
    if (!rateLimit.allowed) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Try again in ${Math.ceil(RateLimiter.getRemainingTime(clientIP) / 1000)} seconds.`
      };
    }

    // Authentication for protected routes
    const url = new URL(request.url);
    const isProtectedRoute = url.pathname.startsWith('/api/protected') ||
                            url.pathname.startsWith('/api/channels') ||
                            url.pathname.startsWith('/api/messages');

    if (isProtectedRoute) {
      const user = await AuthService.getUserFromRequest(request);
      if (!user) {
        return { allowed: false, error: 'Authentication required' };
      }
      return { allowed: true, user };
    }

    return { allowed: true };
  }
}