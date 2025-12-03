/* eslint-disable @typescript-eslint/no-explicit-any */

interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL: number;

  constructor(defaultTTLMs = 3600000) {
    this.defaultTTL = defaultTTLMs;
    setInterval(() => this.cleanup(), 300000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return !!entry && Date.now() <= entry.expiresAt;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cache = new SimpleCache();

export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  messages: (chatId: string) => `messages:${chatId}`,
  onlineUsers: () => 'online_users',
};

export const CacheTTL = {
  user: 15 * 60 * 1000,
  messages: 5 * 60 * 1000,
  onlineUsers: 60 * 1000,
};

export class CacheUtils {
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
  }
}