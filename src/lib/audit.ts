import fs from 'fs';
import path from 'path';

interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details?: any;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class AuditLogger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(process.cwd(), 'logs', 'audit.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  async log(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
    const auditEvent: AuditEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      ...event,
    };

    const logEntry = JSON.stringify(auditEvent) + '\n';

    try {
      fs.appendFileSync(this.logFile, logEntry);
      console.log(`Audit: ${event.action} by ${event.userId} on ${event.resource}`);
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getLogs(limit: number = 100, userId?: string): Promise<AuditEvent[]> {
    try {
      if (!fs.existsSync(this.logFile)) return [];

      const content = fs.readFileSync(this.logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.trim());

      let logs: AuditEvent[] = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (userId) {
        logs = logs.filter(log => log.userId === userId);
      }

      return logs.slice(0, limit);
    } catch (error) {
      console.error('Failed to read audit logs:', error);
      return [];
    }
  }

  async getSecurityEvents(): Promise<AuditEvent[]> {
    const logs = await this.getLogs(1000);
    return logs.filter(log => log.severity === 'high' || log.severity === 'critical');
  }
}

export const auditLogger = new AuditLogger();

// Helper functions for common audit events
export const audit = {
  login: (userId: string, ip?: string, userAgent?: string) =>
    auditLogger.log({
      userId,
      action: 'LOGIN',
      resource: 'auth',
      ip,
      userAgent,
      severity: 'low',
    }),

  logout: (userId: string) =>
    auditLogger.log({
      userId,
      action: 'LOGOUT',
      resource: 'auth',
      severity: 'low',
    }),

  passwordChange: (userId: string) =>
    auditLogger.log({
      userId,
      action: 'PASSWORD_CHANGE',
      resource: 'auth',
      severity: 'medium',
    }),

  fileUpload: (userId: string, fileName: string) =>
    auditLogger.log({
      userId,
      action: 'FILE_UPLOAD',
      resource: 'files',
      details: { fileName },
      severity: 'low',
    }),

  chatMessage: (userId: string, chatId: string) =>
    auditLogger.log({
      userId,
      action: 'CHAT_MESSAGE',
      resource: 'chats',
      details: { chatId },
      severity: 'low',
    }),

  adminAction: (userId: string, action: string, details?: any) =>
    auditLogger.log({
      userId,
      action: 'ADMIN_ACTION',
      resource: 'admin',
      details,
      severity: 'high',
    }),

  securityAlert: (userId: string, alert: string, details?: any) =>
    auditLogger.log({
      userId,
      action: 'SECURITY_ALERT',
      resource: 'security',
      details: { alert, ...details },
      severity: 'critical',
    }),
};