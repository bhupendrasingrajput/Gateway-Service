import axios from 'axios';
import redis from '../config/redis.js';
import config from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';

const { authService } = config.services;

export const authMiddleware = async (req, res, next) => {
    try {

        const redisKey = extractRouteKey(req);
        console.log(redisKey)
        const isPublic = await redis.hGet('public:route', redisKey);

        if (isPublic) return next();

        const token = extractToken(req);
        if (!token) {
            throw new ApiError(401, 'Authorization Token Missing!');
        }

        const { data } = await axios.post(`${authService}/auth/verify-token`, { token });
        req.user = data.user;

        next();
    } catch (error) {
        next(error);
    }
};

function extractRouteKey(req) {
    const method = req.method.toUpperCase();

    // Remove query string and trailing slashes
    let cleanUrl = req.originalUrl.split('?')[0].replace(/\/+$/, '');

    // Remove `/api` prefix if present
    if (cleanUrl.startsWith('/api/')) {
        cleanUrl = cleanUrl.replace(/^\/api/, '');
    } else if (cleanUrl === '/api') {
        cleanUrl = '/';
    }

    // Ensure root path fallback
    const normalizedPath = cleanUrl || '/';

    return `${method}:${normalizedPath}`;
}

function extractToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.split(' ')[1];
}
