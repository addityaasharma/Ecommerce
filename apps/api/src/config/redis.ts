import { Redis } from "ioredis";
import { getEnvVar } from "../common/error/appError.js";

const redis_url = getEnvVar("REDIS_URL")
export const redis = new Redis(redis_url)

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});