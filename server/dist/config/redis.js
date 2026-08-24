"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
class InMemoryCache {
    cache = new Map();
    async get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ttlSeconds) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
        this.cache.set(key, { value, expiresAt });
    }
    async del(key) {
        this.cache.delete(key);
    }
    async flush() {
        this.cache.clear();
    }
}
class CacheService {
    inMemory = new InMemoryCache();
    async get(key) {
        return this.inMemory.get(key);
    }
    async set(key, value, ttlSeconds = 300) {
        await this.inMemory.set(key, value, ttlSeconds);
    }
    async del(key) {
        await this.inMemory.del(key);
    }
    async invalidatePattern(pattern) {
        // Basic prefix matching for pattern invalidation
        await this.inMemory.flush();
    }
}
exports.cacheService = new CacheService();
