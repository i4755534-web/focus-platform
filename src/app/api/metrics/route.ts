import { NextResponse } from 'next/server';

// Simple metrics collector for Prometheus
// In production, use prom-client library

class MetricsCollector {
  private metrics: Map<string, number> = new Map();

  increment(name: string, value: number = 1) {
    this.metrics.set(name, (this.metrics.get(name) || 0) + value);
  }

  set(name: string, value: number) {
    this.metrics.set(name, value);
  }

  get(name: string): number {
    return this.metrics.get(name) || 0;
  }

  toPrometheusFormat(): string {
    let output = '# FOCUS Platform Metrics\n';

    // Request metrics
    output += `# HELP focus_requests_total Total number of requests\n`;
    output += `# TYPE focus_requests_total counter\n`;
    output += `focus_requests_total ${this.get('requests_total')}\n\n`;

    // Error metrics
    output += `# HELP focus_errors_total Total number of errors\n`;
    output += `# TYPE focus_errors_total counter\n`;
    output += `focus_errors_total ${this.get('errors_total')}\n\n`;

    // User metrics
    output += `# HELP focus_active_users Current active users\n`;
    output += `# TYPE focus_active_users gauge\n`;
    output += `focus_active_users ${this.get('active_users')}\n\n`;

    // Chat metrics
    output += `# HELP focus_chat_messages_total Total chat messages\n`;
    output += `# TYPE focus_chat_messages_total counter\n`;
    output += `focus_chat_messages_total ${this.get('chat_messages_total')}\n\n`;

    // AI metrics
    output += `# HELP focus_ai_requests_total Total AI API requests\n`;
    output += `# TYPE focus_ai_requests_total counter\n`;
    output += `focus_ai_requests_total ${this.get('ai_requests_total')}\n\n`;

    // Performance metrics
    output += `# HELP focus_response_time Average response time in ms\n`;
    output += `# TYPE focus_response_time gauge\n`;
    output += `focus_response_time ${this.get('avg_response_time')}\n\n`;

    return output;
  }
}

export const metricsCollector = new MetricsCollector();

// Middleware to collect metrics
export function collectMetrics(req: any, res: any, next?: any) {
  metricsCollector.increment('requests_total');

  const startTime = Date.now();

  // In Next.js, we can't modify response directly
  // This would be used in custom middleware
  if (next) next();

  // For demonstration, update some mock metrics
  metricsCollector.set('active_users', Math.floor(Math.random() * 100) + 50);
  metricsCollector.set('avg_response_time', Math.floor(Math.random() * 200) + 50);
}

export async function GET() {
  // Update some metrics
  metricsCollector.set('active_users', Math.floor(Math.random() * 100) + 50);
  metricsCollector.set('avg_response_time', Math.floor(Math.random() * 200) + 50);

  const metrics = metricsCollector.toPrometheusFormat();

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}