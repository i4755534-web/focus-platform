import { NextRequest, NextResponse } from 'next/server';
import { AuthService, SecurityMiddleware } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
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

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers: SecurityMiddleware.corsHeaders }
      );
    }

    const user = await AuthService.authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: SecurityMiddleware.corsHeaders }
      );
    }

    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update user status
    user.status = 'online';
    user.lastSeen = new Date();

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

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
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