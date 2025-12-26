import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Mock authentication for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    nickname: 'Test User',
    phone: '+1234567890',
  },
  {
    id: '2',
    email: 'admin@example.com',
    username: 'admin',
    nickname: 'Admin User',
    phone: '+0987654321',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Simple mock authentication
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user || password !== 'password123') {
      return NextResponse.json({ error: 'Неверные учетные данные' }, { status: 401 });
    }

    // Mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname,
        phone: user.phone,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}