import redisClient from "../config/redis.js";

const DEFAULT_TTL_SECONDS = 60;

export const getCache = async (key) => {
    try {
        const cached = await redisClient.get(key);
        return cached ? JSON.parse(cached) : null;
    } catch (err) {
        console.error("Cache read error:", err.message);
        return null;
    }
};

export const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
    try {
        await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (err) {
        console.error("Cache write error:", err.message);
    }
};


export const invalidateCache = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.error("Cache invalidation error:", err.message);
    }
};
