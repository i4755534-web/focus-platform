import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './database';
import type { User } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface JWTPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await db.getUserByEmail(email);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) return null;

    return user;
  }

  static async registerUser(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    interests?: string[];
    hobbies?: string[];
    games?: string[];
  }): Promise<User | null> {
    const existingUser = await db.getUserByEmail(userData.email);
    if (existingUser) return null;

    const hashedPassword = await this.hashPassword(userData.password);

    const user = await db.createUser({
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      password: hashedPassword,
      gender: userData.gender,
      age: userData.age,
      interests: userData.interests || [],
      hobbies: userData.hobbies || [],
      games: userData.games || [],
    });

    return user;
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
  }

  static async getUserFromRequest(request: Request): Promise<User | null> {
    const authHeader = request.headers.get('authorization');
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) return null;

    const payload = this.verifyToken(token);
    if (!payload) return null;

    return db.getUser(payload.userId);
  }
}