import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age').optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  games: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    const { email, username, displayName, password, ...optionalFields } = validatedData;

    const user = await AuthService.registerUser({ email, username, displayName, password, ...optionalFields });

    if (!user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const token = AuthService.generateToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
      token,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}