export const APP_CONFIG = {
  PORT: process.env.PORT ?? 8080,
  API_PREFIX: '/api/v1',
  CACHE_SUBTREE_TTL_SECONDS: process.env.CACHE_SUBTREE_TTL_SECONDS ?? 300,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
};
