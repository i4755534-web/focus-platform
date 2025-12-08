import { NextRequest, NextResponse } from 'next/server';
import { auditLogger } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId') || undefined;
    const type = searchParams.get('type') || 'all'; // all, security, admin

    let logs;

    if (type === 'security') {
      logs = await auditLogger.getSecurityEvents();
    } else {
      logs = await auditLogger.getLogs(limit, userId);
    }

    // Filter by type if specified
    if (type === 'admin') {
      logs = logs.filter(log => log.action.includes('ADMIN'));
    }

    return NextResponse.json({
      logs,
      total: logs.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Audit API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}