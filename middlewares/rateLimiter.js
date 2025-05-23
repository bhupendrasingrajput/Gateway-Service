import config from '../config/index.js';
const { windowMs, max } = config.limiter;

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const windowSeconds = parseInt(windowMs);
const maxRequests = parseInt(max);

export const createRateLimiter = (redis) => {
    return rateLimit({
        windowMs: windowSeconds * 1000,
        max: maxRequests,
        message: 'Too many requests from this IP. Please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args) => redis.sendCommand(args)
        })
    });
};
