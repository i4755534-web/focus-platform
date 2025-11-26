import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if user has permission to read this channel
    const channel = await db.getChannel(params.channelId);
    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404, headers: SecurityMiddleware.securityHeaders }
      );
    }

    // Check permissions
    const canRead = channel.permissions.read.includes('*') ||
                    channel.permissions.read.includes(securityCheck.user.id) ||
                    ['admin', 'moderator'].includes(securityCheck.user.role);

    if (!canRead) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403, headers: SecurityMiddleware.securityHeaders }
      );
    }

    const messages = await db.getMessages(params.channelId, limit, offset);

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit,
      },
    }, { headers: SecurityMiddleware.securityHeaders });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: SecurityMiddleware.securityHeaders }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
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

    // Check if channel exists
    const channel = await db.getChannel(params.channelId);
    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404, headers: SecurityMiddleware.securityHeaders }
      );
    }

    // Check write permissions
    const canWrite = channel.permissions.write.includes('*') ||
                     channel.permissions.write.includes(securityCheck.user.id) ||
                     ['admin', 'moderator'].includes(securityCheck.user.role);

    if (!canWrite) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403, headers: SecurityMiddleware.securityHeaders }
      );
    }

    const { content, type = 'text', attachments = [], replyTo } = await request.json();

    if (!content && type === 'text') {
      return NextResponse.json(
        { error: 'Content is required for text messages' },
        { status: 400, headers: SecurityMiddleware.securityHeaders }
      );
    }

    const message = await db.createMessage({
      content,
      authorId: securityCheck.user.id,
      channelId: params.channelId,
      type,
      attachments,
      replyTo,
      reactions: [],
      edited: false,
    });

    return NextResponse.json({
      success: true,
      message,
    }, { status: 201, headers: SecurityMiddleware.securityHeaders });

  } catch (error) {
    console.error('Create message error:', error);
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