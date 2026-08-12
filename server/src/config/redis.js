import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times) {
        return Math.min(times * 200, 2000);
    },
});

redisClient.on("connect", () => {
    console.log(" Redis connected");
});

redisClient.on("error", (err) => {
    console.error(" Redis error:", err.message);
});

export default redisClient;
