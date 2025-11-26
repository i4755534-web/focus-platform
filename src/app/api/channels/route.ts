import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Security check
    const securityCheck = await SecurityMiddleware.handleRequest(request);
    if (!securityCheck.allowed) {
      return NextResponse.json(
        { error: securityCheck.error },
        {
          status: securityCheck.error?.includes('Rate limit') ? 429 : 401,
          headers: SecurityMiddleware.securityHeaders
        }
      );
    }

    const channels = await db.getChannels();

    return NextResponse.json({
      success: true,
      channels,
    }, { headers: SecurityMiddleware.securityHeaders });

  } catch (error) {
    console.error('Get channels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: SecurityMiddleware.securityHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security check
    const securityCheck = await SecurityMiddleware.handleRequest(request);
    if (!securityCheck.allowed || !securityCheck.user) {
      return NextResponse.json(
        { error: securityCheck.error || 'Authentication required' },
        {
          status: securityCheck.error?.includes('Rate limit') ? 429 : 401,
          headers: SecurityMiddleware.securityHeaders
        }
      );
    }

    // Only admins and moderators can create channels
    if (!['admin', 'moderator'].includes(securityCheck.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403, headers: SecurityMiddleware.securityHeaders }
      );
    }

    const { name, description, type, category, isPrivate } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400, headers: SecurityMiddleware.securityHeaders }
      );
    }

    const channel = await db.createChannel({
      name,
      description,
      type,
      category,
      position: 0, // Will be calculated based on existing channels
      permissions: {
        read: isPrivate ? [securityCheck.user.id] : ['*'],
        write: isPrivate ? [securityCheck.user.id] : ['*'],
        manage: ['admin', 'moderator'],
      },
      memberCount: 1,
      isPrivate: isPrivate || false,
    });

    return NextResponse.json({
      success: true,
      channel,
    }, { status: 201, headers: SecurityMiddleware.securityHeaders });

  } catch (error) {
    console.error('Create channel error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: SecurityMiddleware.securityHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: SecurityMiddleware.corsHeaders,
  });
}