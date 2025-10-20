import Redis from 'ioredis';
import { ICache } from '@application/ports/cache.port';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

export class RedisCache implements ICache {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (raw) {
      console.log(`[CACHE HIT] ${key}`);
      return JSON.parse(raw);
    }
    console.log(`[CACHE MISS] ${key}`);
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}