import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class CacheManager {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();

  constructor() {
    this.init();
  }

  private init() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          retryStrategy: (times) => {
            if (times > 3) {
              console.warn('[Redis] Connection failed, falling back to in-memory cache.');
              this.redis = null;
              return null; // Stop retrying
            }
            return Math.min(times * 50, 2000);
          }
        });
        
        this.redis.on('error', (err) => {
          console.warn('[Redis] Error:', err.message);
        });

        this.redis.on('connect', () => {
          console.log('[Redis] Connected successfully.');
        });
      } catch (err) {
        console.warn('[Redis] Initialization error, falling back to memory cache.', err);
        this.redis = null;
      }
    } else {
      console.log('[Redis] No REDIS_URL provided, using in-memory cache.');
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.redis) {
      try {
        return await this.redis.get(key);
      } catch {
        // Fallback if redis suddenly fails
        return this.memoryGet(key);
      }
    }
    return this.memoryGet(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (this.redis) {
      try {
        if (expireSeconds) {
          await this.redis.set(key, value, 'EX', expireSeconds);
        } else {
          await this.redis.set(key, value);
        }
        return;
      } catch {
        // Ignore and fallback
      }
    }
    this.memorySet(key, value, expireSeconds);
  }

  private memoryGet(key: string): string | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt > 0 && Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  private memorySet(key: string, value: string, expireSeconds?: number) {
    const expiresAt = expireSeconds ? Date.now() + expireSeconds * 1000 : 0;
    this.memoryCache.set(key, { value, expiresAt });
  }

  // Get raw redis client for BullMQ if needed
  getRedisClient(): Redis | null {
    return this.redis;
  }
}

export const cache = new CacheManager();
