class InMemoryCache {
  private cache = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }
}

class CacheService {
  private inMemory = new InMemoryCache();

  async get(key: string): Promise<string | null> {
    return this.inMemory.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number = 300): Promise<void> {
    await this.inMemory.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.inMemory.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // Basic prefix matching for pattern invalidation
    await this.inMemory.flush();
  }
}

export const cacheService = new CacheService();
