// Simple mock database for demo

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  password: string;
  createdAt: Date;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  interests: string[];
  hobbies: string[];
  games: string[];
  bio?: string;
  photos: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  createdAt: Date;
}

class MockDatabase {
  private users: Map<string, User> = new Map();
  private channels: Map<string, Channel> = new Map();
  private messages: Map<string, Message> = new Map();

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
      password: 'hashedpass',
      createdAt: new Date('2024-01-01'),
      gender: 'male',
      age: 30,
      interests: ['programming', 'gaming'],
      hobbies: ['coding', 'reading'],
      games: ['strategy', 'rpg'],
      photos: [],
      location: { lat: 55.7558, lng: 37.6173 }, // Moscow
    };

    const user1: User = {
      id: 'user-1',
      email: 'user1@focus.com',
      username: 'user1',
      displayName: 'Пользователь 1',
      password: 'hashedpass',
      createdAt: new Date('2024-01-15'),
      gender: 'female',
      age: 25,
      interests: ['music', 'art'],
      hobbies: ['painting', 'singing'],
      games: ['puzzle', 'adventure'],
      photos: ['/avatars/user1-1.jpg', '/avatars/user1-2.jpg'],
      location: { lat: 59.9343, lng: 30.3351 }, // St. Petersburg
    };

    const user2: User = {
      id: 'user-2',
      email: 'user2@focus.com',
      username: 'user2',
      displayName: 'Пользователь 2',
      password: 'hashedpass',
      createdAt: new Date('2024-01-20'),
      gender: 'male',
      age: 28,
      interests: ['programming', 'gaming'],
      hobbies: ['coding', 'gaming'],
      games: ['strategy', 'rpg'],
      photos: ['/avatars/user2-1.jpg'],
      location: { lat: 55.7558, lng: 37.6173 }, // Moscow
    };

    const user3: User = {
      id: 'user-3',
      email: 'user3@focus.com',
      username: 'user3',
      displayName: 'Пользователь 3',
      password: 'hashedpass',
      createdAt: new Date('2024-01-25'),
      gender: 'female',
      age: 22,
      interests: ['sports', 'travel'],
      hobbies: ['running', 'photography'],
      games: ['sports', 'simulation'],
      photos: ['/avatars/user3-1.jpg', '/avatars/user3-2.jpg', '/avatars/user3-3.jpg'],
      location: { lat: 56.8389, lng: 60.6057 }, // Yekaterinburg
    };

    this.users.set(admin.id, admin);
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

    // Create default channels
    const general: Channel = {
      id: 'general',
      name: 'general',
      description: 'Общий чат',
      createdAt: new Date('2024-01-01'),
    };

    const random: Channel = {
      id: 'random',
      name: 'random',
      description: 'Случайный чат',
      createdAt: new Date('2024-01-01'),
    };

    this.channels.set(general.id, general);
    this.channels.set(random.id, random);

    // Create sample messages
    const message1: Message = {
      id: 'msg-1',
      content: 'Добро пожаловать в FOCUS!',
      authorId: admin.id,
      channelId: general.id,
      createdAt: new Date('2024-01-01T10:00:00'),
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

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'photos'> & { photos?: string[] }): Promise<User> {
    const id = `user-${Date.now()}`;
    const user: User = {
      ...userData,
      photos: userData.photos || [],
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Channel methods
  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }

  async getChannel(id: string): Promise<Channel | null> {
    return this.channels.get(id) || null;
  }

  async createChannel(channelData: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel> {
    const id = `channel-${Date.now()}`;
    const channel: Channel = {
      ...channelData,
      id,
      createdAt: new Date(),
    };
    this.channels.set(id, channel);
    return channel;
  }

  // Message methods
  async getMessages(channelId: string, limit = 50): Promise<Message[]> {
    const messages = Array.from(this.messages.values())
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return messages.reverse();
  }

  async createMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const id = `msg-${Date.now()}`;
    const message: Message = {
      ...messageData,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const db = new MockDatabase();