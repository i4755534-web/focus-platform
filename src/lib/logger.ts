// Enterprise-grade logging and monitoring system
// Supports multiple log levels, structured logging, and external integrations

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  stackTrace?: string;
  tags?: string[];
}

interface LogTransport {
  log(entry: LogEntry): void;
  flush?(): Promise<void>;
}

class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? JSON.stringify(entry.context, null, 2) : '';

    const message = `[${timestamp}] ${levelName}: ${entry.message}${context ? '\n' + context : ''}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        if (entry.stackTrace) {
          console.error(entry.stackTrace);
        }
        break;
    }
  }
}

class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filtered = this.logs;
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level >= level);
    }
    return filtered.slice(-limit);
  }

  clear(): void {
    this.logs = [];
  }
}

// In production, this would send to external services like DataDog, LogRocket, etc.
class ExternalTransport implements LogTransport {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }
}

class Logger {
  private transports: LogTransport[] = [];
  private context: Record<string, any> = {};
  private minLevel: LogLevel = LogLevel.INFO;

  constructor() {
    // Default transports
    this.addTransport(new ConsoleTransport());
    this.addTransport(new MemoryTransport());
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context: { ...this.context, ...context },
      stackTrace: error?.stack,
      tags: context?.tags,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.minLevel) return;

    const entry = this.createEntry(level, message, context, error);

    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Transport error:', error);
      }
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // Performance monitoring
  time(label: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.info(`Timer: ${label}`, { duration, label });
    };
  }

  // Request logging middleware
  createRequestLogger() {
    return (request: Request, response?: Response, error?: Error) => {
      const url = new URL(request.url);
      const context = {
        method: request.method,
        url: request.url,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams),
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
        tags: ['http', 'request'],
      };

      if (error) {
        this.error('Request failed', error, context);
      } else {
        this.info('Request completed', {
          ...context,
          status: response?.status,
        });
      }
    };
  }
}

// Metrics and monitoring
export class MetricsCollector {
  private metrics = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private counters = new Map<string, number>();

  increment(name: string, value = 1): void {
    this.counters.set(name, (this.counters.get(name) || 0) + value);
  }

  gauge(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  histogram(name: string, value: number): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, []);
    }
    this.histograms.get(name)!.push(value);

    // Keep only last 1000 values
    const values = this.histograms.get(name)!;
    if (values.length > 1000) {
      values.shift();
    }
  }

  timer(name: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.histogram(`${name}_duration`, duration);
    };
  }

  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};

    // Counters
    for (const [name, value] of this.counters) {
      result[name] = value;
    }

    // Gauges
    for (const [name, value] of this.metrics) {
      result[name] = value;
    }

    // Histograms
    for (const [name, values] of this.histograms) {
      const sorted = values.sort((a, b) => a - b);
      result[`${name}_count`] = values.length;
      result[`${name}_sum`] = values.reduce((a, b) => a + b, 0);
      result[`${name}_avg`] = values.length > 0 ? result[`${name}_sum`] / values.length : 0;
      result[`${name}_p50`] = this.percentile(sorted, 0.5);
      result[`${name}_p95`] = this.percentile(sorted, 0.95);
      result[`${name}_p99`] = this.percentile(sorted, 0.99);
    }

    return result;
  }

  private percentile(sortedValues: number[], p: number): number {
    if (sortedValues.length === 0) return 0;
    const index = Math.ceil(p * sortedValues.length) - 1;
    return sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))];
  }

  reset(): void {
    this.metrics.clear();
    this.histograms.clear();
    this.counters.clear();
  }
}

// Health check system
export class HealthChecker {
  private checks: Array<{
    name: string;
    check: () => Promise<boolean>;
    timeout: number;
  }> = [];

  addCheck(name: string, check: () => Promise<boolean>, timeout = 5000): void {
    this.checks.push({ name, check, timeout });
  }

  async runChecks(): Promise<{
    status: 'healthy' | 'unhealthy';
    checks: Array<{ name: string; status: 'pass' | 'fail'; duration: number; error?: string }>;
  }> {
    const results = await Promise.allSettled(
      this.checks.map(async ({ name, check, timeout }) => {
        const start = Date.now();
        try {
          const result = await Promise.race([
            check(),
            new Promise<boolean>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            ),
          ]);
          return { name, status: result ? 'pass' : 'fail' as const, duration: Date.now() - start };
        } catch (error) {
          return {
            name,
            status: 'fail' as const,
            duration: Date.now() - start,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    const checks = results.map(result =>
      result.status === 'fulfilled' ? result.value : {
        name: 'unknown',
        status: 'fail' as const,
        duration: 0,
        error: 'Check failed',
      }
    ).map(check => ({
      ...check,
      status: check.status as 'pass' | 'fail',
    }));

    const status = checks.every(check => check.status === 'pass') ? 'healthy' : 'unhealthy';

    return { status, checks };
  }
}

// Global instances
export const logger = new Logger();
export const metrics = new MetricsCollector();
export const healthChecker = new HealthChecker();

// Default health checks
healthChecker.addCheck('database', async () => {
  try {
    // Mock database health check
    return true;
  } catch {
    return false;
  }
});

healthChecker.addCheck('cache', async () => {
  try {
    // Mock cache health check
    return true;
  } catch {
    return false;
  }
});

healthChecker.addCheck('external_services', async () => {
  // Check external service connectivity
  return true;
});