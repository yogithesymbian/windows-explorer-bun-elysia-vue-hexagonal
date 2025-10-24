// /backend/explorer/infrastructure/src/adapter/redis.cache.ts
import Redis from 'ioredis';
import { ICache } from '@application/ports/cache.port';
import { APP_CONFIG } from '@api/config/app.config';

const redis = new Redis(APP_CONFIG.REDIS_URL);

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