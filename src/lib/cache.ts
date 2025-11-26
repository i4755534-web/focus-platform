// Enterprise-level caching system (Redis-like implementation)
// In production, replace with actual Redis or similar

interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  totalSize: number;
  itemCount: number;
}

class LRUCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private defaultTTL: number;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalSize: 0,
    itemCount: 0,
  };

  constructor(maxSizeBytes = 50 * 1024 * 1024, defaultTTLMs = 3600000) { // 50MB, 1 hour
    this.maxSize = maxSizeBytes;
    this.defaultTTL = defaultTTLMs;

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  private evictIfNeeded(): void {
    if (this.stats.totalSize <= this.maxSize) return;

    // Sort by access time (LRU)
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

    for (const [key, entry] of entries) {
      if (this.stats.totalSize <= this.maxSize * 0.8) break; // Keep 80% free

      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.itemCount--;
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.stats.totalSize -= entry.size;
        this.stats.itemCount--;
        this.stats.deletes++;
      }
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const size = this.calculateSize(value);
    const expiresAt = Date.now() + (ttl || this.defaultTTL);

    // Remove old entry if exists
    const existing = this.cache.get(key);
    if (existing) {
      this.stats.totalSize -= existing.size;
    }

    const entry: CacheEntry<T> = {
      data: value,
      expiresAt,
      lastAccessed: Date.now(),
      accessCount: 0,
      size,
    };

    this.cache.set(key, entry);
    this.stats.totalSize += size;
    this.stats.itemCount++;
    this.stats.sets++;

    this.evictIfNeeded();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.itemCount--;
      this.stats.deletes++;
      this.stats.misses++;
      return null;
    }

    entry.lastAccessed = Date.now();
    entry.accessCount++;
    this.stats.hits++;
    return entry.data;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.stats.totalSize -= entry.size;
    this.stats.itemCount--;
    this.stats.deletes++;
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      totalSize: 0,
      itemCount: 0,
    };
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return !!entry && Date.now() <= entry.expiresAt;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Advanced features
  async preload<T>(keys: string[]): Promise<void> {
    // In production, this could load from Redis cluster
    // For now, just ensure keys exist
    keys.forEach(key => {
      if (this.cache.has(key)) {
        const entry = this.cache.get(key)!;
        entry.lastAccessed = Date.now();
      }
    });
  }

  async invalidatePattern(pattern: string): Promise<number> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        deleted++;
      }
    }

    return deleted;
  }

  // Pub/Sub simulation (for cache invalidation across instances)
  private subscribers = new Map<string, Set<(data: any) => void>>();

  subscribe(channel: string, callback: (data: any) => void): void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(callback);
  }

  unsubscribe(channel: string, callback: (data: any) => void): void {
    const subs = this.subscribers.get(channel);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.subscribers.delete(channel);
      }
    }
  }

  publish(channel: string, data: any): void {
    const subs = this.subscribers.get(channel);
    if (subs) {
      subs.forEach(callback => callback(data));
    }
  }
}

// Global cache instance
export const cache = new LRUCache();

// Cache key generators
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  channel: (id: string) => `channel:${id}`,
  messages: (channelId: string, page = 0) => `messages:${channelId}:${page}`,
  userChannels: (userId: string) => `user_channels:${userId}`,
  onlineUsers: () => 'online_users',
  analytics: (type: string) => `analytics:${type}`,
};

// Cache TTL constants
export const CacheTTL = {
  user: 15 * 60 * 1000, // 15 minutes
  channel: 30 * 60 * 1000, // 30 minutes
  messages: 5 * 60 * 1000, // 5 minutes
  onlineUsers: 60 * 1000, // 1 minute
  analytics: 10 * 60 * 1000, // 10 minutes
};

// Cache utilities
export class CacheUtils {
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    let data = cache.get<T>(key);
    if (data !== null) {
      return data;
    }

    data = await fetcher();
    cache.set(key, data, ttl);
    return data;
  }

  static invalidateUserData(userId: string): void {
    cache.invalidatePattern(`user:${userId}*`);
    cache.invalidatePattern(`*${userId}*`);
  }

  static invalidateChannelData(channelId: string): void {
    cache.invalidatePattern(`*${channelId}*`);
  }

  static getCacheStats() {
    return cache.getStats();
  }
}