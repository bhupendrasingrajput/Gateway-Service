import axios from 'axios';
import redis from '../config/redis.js';
import config from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';

const { authService } = config.services;

export const authMiddleware = async (req, res, next) => {
    try {
        const redisKey = extractRouteKey(req);
        const isPublic = await redis.hGet('public:route', redisKey);
        if (isPublic) return next();

        const token = extractToken(req);
        if (!token) throw new ApiError(401, 'Authorization Token Missing');

        const { data } = await axios.post(`${authService}/verify-token`, { token });

        req.headers['authorization'] = `Bearer ${token}`;
        req.user = data.user;

        const encodedUser = Buffer.from(JSON.stringify(data.user)).toString('base64');
        req.headers['x-user'] = encodedUser;

        next();
    } catch (error) {
        if (error.response?.data?.message) {
            return res.status(error.response.status || 500).json({
                status: 'error',
                message: error.response.data.message,
                stack: error.response.data.stack
            });
        }
        next(error);
    }
};

function extractRouteKey(req) {
    const method = req.method.toUpperCase();
    let cleanUrl = req.originalUrl.split('?')[0].replace(/\/+$/, '');
    if (cleanUrl.startsWith('/api/')) cleanUrl = cleanUrl.replace(/^\/api/, '');
    if (cleanUrl === '/api') cleanUrl = '/';
    return `${method}:${cleanUrl || '/'}`;
}

function extractToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.split(' ')[1];
}
