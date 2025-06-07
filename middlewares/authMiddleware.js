import axios from 'axios';
import config from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { isPublicRoute, getServiceFromPath } from '../helpers/publicRoutes.js';

const { authService } = config.services;

export const authMiddleware = async (req, res, next) => {
    try {
        const method = req.method.toUpperCase();
        const path = req.originalUrl.split('?')[0].replace(/\/+$/, '') || '/';
        const actualPath = path.replace(/^\/api/, '') || '/';

        const service = getServiceFromPath(actualPath);

        const isPublic = await isPublicRoute(service, method, actualPath);
        if (isPublic) return next();

        const token = extractToken(req);
        if (!token) throw new ApiError(401, 'Authorization Token Missing');

        const { data } = await axios.post(`${authService}/verify-token`, { token });

        req.headers['authorization'] = `Bearer ${token}`;
        req.user = data.user;
        req.headers['x-user'] = Buffer.from(JSON.stringify(data.user)).toString('base64');

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

function extractToken(req) {
    const authHeader = req.headers['authorization'];
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}
