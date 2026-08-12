import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";


const buildLimiter = ({ windowMs, max, message, prefix }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message,
        },
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix,
        }),
    });

// General API limiter — applied globally in app.js
export const apiLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    prefix: "rl:api:",
});

// Stricter limiter for auth routes (login/register) to slow down brute force
export const authLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many auth attempts, please try again in a few minutes.",
    prefix: "rl:auth:",
});

// The /news/sync route is unauthenticated and hits external APIs + Mongo
// bulkWrite, so it gets its own tight limit to prevent abuse.
export const syncLimiter = buildLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 2,
    message: "Sync was just triggered, please wait before retrying.",
    prefix: "rl:sync:",
});
