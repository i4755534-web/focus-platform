import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, username, displayName, password } = await request.json();

    if (!email || !username || !displayName || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    const user = await AuthService.registerUser({ email, username, displayName, password });

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