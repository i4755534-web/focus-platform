import { NextRequest, NextResponse } from 'next/server';
import { AuthService, SecurityMiddleware } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Security check
    const securityCheck = await SecurityMiddleware.handleRequest(request);
    if (!securityCheck.allowed) {
      return NextResponse.json(
        { error: securityCheck.error },
        {
          status: securityCheck.error?.includes('Rate limit') ? 429 : 401,
          headers: SecurityMiddleware.corsHeaders
        }
      );
    }

    const { email, username, displayName, password } = await request.json();

    if (!email || !username || !displayName || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers: SecurityMiddleware.corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: SecurityMiddleware.corsHeaders }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400, headers: SecurityMiddleware.corsHeaders }
      );
    }

    const user = await AuthService.registerUser({
      email,
      username,
      displayName,
      password,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409, headers: SecurityMiddleware.corsHeaders }
      );
    }

    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        preferences: user.preferences,
        stats: user.stats,
      },
      token,
    }, { headers: SecurityMiddleware.corsHeaders });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: SecurityMiddleware.corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: SecurityMiddleware.corsHeaders,
  });
}