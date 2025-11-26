// Mock Database with proper structure for enterprise application
// In production, this would be replaced with PostgreSQL/MongoDB

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'ru' | 'en';
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    messagesSent: number;
    filesUploaded: number;
    voiceMessages: number;
    achievements: string[];
    level: number;
    xp: number;
  };
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'voice' | 'announcement';
  category?: string;
  position: number;
  permissions: {
    read: string[];
    write: string[];
    manage: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  isPrivate: boolean;
}

interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  type: 'text' | 'file' | 'voice' | 'system';
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  replyTo?: string;
  edited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  threadId?: string;
}

interface Thread {
  id: string;
  title: string;
  authorId: string;
  channelId: string;
  messageCount: number;
  lastMessageAt: Date;
  createdAt: Date;
}

interface File {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  channelId?: string;
  messageId?: string;
  versions: Array<{
    id: string;
    size: number;
    uploadedAt: Date;
  }>;
  createdAt: Date;
}

interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'discord' | 'github' | 'google' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
  createdBy: string;
  createdAt: Date;
}

interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  targetId?: string;
  targetType?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

class MockDatabase {
  private users: Map<string, User> = new Map();
  private channels: Map<string, Channel> = new Map();
  private messages: Map<string, Message> = new Map();
  private threads: Map<string, Thread> = new Map();
  private files: Map<string, File> = new Map();
  private integrations: Map<string, Integration> = new Map();
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create default users
    const admin: User = {
      id: 'admin-1',
      email: 'admin@focus.com',
      username: 'admin',
      displayName: 'Администратор',
      role: 'admin',
      status: 'online',
      lastSeen: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      preferences: {
        theme: 'dark',
        language: 'ru',
        notifications: true,
        soundEnabled: true,
      },
      stats: {
        messagesSent: 1000,
        filesUploaded: 50,
        voiceMessages: 20,
        achievements: ['first_message', 'admin_badge'],
        level: 10,
        xp: 2500,
      },
    };

    const user1: User = {
      id: 'user-1',
      email: 'user1@focus.com',
      username: 'user1',
      displayName: 'Пользователь 1',
      role: 'user',
      status: 'online',
      lastSeen: new Date(),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      preferences: {
        theme: 'system',
        language: 'ru',
        notifications: true,
        soundEnabled: false,
      },
      stats: {
        messagesSent: 150,
        filesUploaded: 10,
        voiceMessages: 5,
        achievements: ['first_message'],
        level: 3,
        xp: 750,
      },
    };

    this.users.set(admin.id, admin);
    this.users.set(user1.id, user1);

    // Create default channels
    const general: Channel = {
      id: 'general',
      name: 'general',
      description: 'Общий чат',
      type: 'text',
      position: 0,
      permissions: {
        read: ['*'],
        write: ['*'],
        manage: ['admin'],
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      memberCount: 2,
      isPrivate: false,
    };

    const random: Channel = {
      id: 'random',
      name: 'random',
      description: 'Случайный чат',
      type: 'text',
      position: 1,
      permissions: {
        read: ['*'],
        write: ['*'],
        manage: ['admin', 'moderator'],
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      memberCount: 2,
      isPrivate: false,
    };

    this.channels.set(general.id, general);
    this.channels.set(random.id, random);

    // Create sample messages
    const message1: Message = {
      id: 'msg-1',
      content: 'Добро пожаловать в FOCUS!',
      authorId: admin.id,
      channelId: general.id,
      type: 'text',
      reactions: [],
      createdAt: new Date('2024-01-01T10:00:00'),
      updatedAt: new Date('2024-01-01T10:00:00'),
      edited: false,
    };

    this.messages.set(message1.id, message1);
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `user-${Date.now()}`;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    this.logAudit('user_created', id, 'user', id, {});
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    this.logAudit('user_updated', id, 'user', id, {});
    return updatedUser;
  }

  // Channel methods
  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values()).sort((a, b) => a.position - b.position);
  }

  async getChannel(id: string): Promise<Channel | null> {
    return this.channels.get(id) || null;
  }

  async createChannel(channelData: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Channel> {
    const id = `channel-${Date.now()}`;
    const channel: Channel = {
      ...channelData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.channels.set(id, channel);
    this.logAudit('channel_created', 'system', 'channel', id, {});
    return channel;
  }

  // Message methods
  async getMessages(channelId: string, limit = 50, offset = 0): Promise<Message[]> {
    const messages = Array.from(this.messages.values())
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    return messages.reverse();
  }

  async createMessage(messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    const id = `msg-${Date.now()}`;
    const message: Message = {
      ...messageData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.set(id, message);
    this.logAudit('message_created', message.authorId, 'message', id, { channelId: message.channelId });
    return message;
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | null> {
    const message = this.messages.get(id);
    if (!message) return null;

    const updatedMessage = { ...message, ...updates, updatedAt: new Date(), edited: true, editedAt: new Date() };
    this.messages.set(id, updatedMessage);
    this.logAudit('message_updated', message.authorId, 'message', id, {});
    return updatedMessage;
  }

  async deleteMessage(id: string, deletedBy: string): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;

    this.messages.delete(id);
    this.logAudit('message_deleted', deletedBy, 'message', id, { channelId: message.channelId });
    return true;
  }

  // File methods
  async uploadFile(fileData: Omit<File, 'id' | 'createdAt'>): Promise<File> {
    const id = `file-${Date.now()}`;
    const file: File = {
      ...fileData,
      id,
      createdAt: new Date(),
    };
    this.files.set(id, file);
    this.logAudit('file_uploaded', file.uploadedBy, 'file', id, { fileName: file.name });
    return file;
  }

  // Integration methods
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async createIntegration(integrationData: Omit<Integration, 'id' | 'createdAt'>): Promise<Integration> {
    const id = `integration-${Date.now()}`;
    const integration: Integration = {
      ...integrationData,
      id,
      createdAt: new Date(),
    };
    this.integrations.set(id, integration);
    this.logAudit('integration_created', integration.createdBy, 'integration', id, {});
    return integration;
  }

  // Audit logging
  private logAudit(action: string, actorId: string, targetId?: string, targetType?: string, details: Record<string, any> = {}, ipAddress = '127.0.0.1', userAgent = 'Mock User Agent') {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      action,
      actorId,
      targetId,
      targetType,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    };
    this.auditLogs.push(log);
  }

  async getAuditLogs(limit = 100, offset = 0): Promise<AuditLog[]> {
    return this.auditLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    const totalUsers = this.users.size;
    const totalChannels = this.channels.size;
    const totalMessages = this.messages.size;
    const totalFiles = this.files.size;

    const activeUsers = Array.from(this.users.values()).filter(user =>
      user.status === 'online' || (Date.now() - user.lastSeen.getTime()) < 300000 // 5 minutes
    ).length;

    return {
      totalUsers,
      totalChannels,
      totalMessages,
      totalFiles,
      activeUsers,
      auditLogsCount: this.auditLogs.length,
    };
  }
}

export const db = new MockDatabase();
export type { User, Channel, Message, Thread, File, Integration, AuditLog };