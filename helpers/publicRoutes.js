import redis from '../config/redis.js';
import { pathToRegexp } from 'path-to-regexp';

const publicRouteCache = {};

export const isPublicRoute = async (service, method, actualPath) => {
    method = method.toUpperCase();

    if (!publicRouteCache[service]?.[method]) {
        const redisKey = `public:route:${service}:${method}`;
        const raw = await redis.get(redisKey);
        if (!raw) return false;

        const paths = JSON.parse(raw);
        const compiled = paths.map(path => ({
            path,
            regex: pathToRegexp(path)
        }));

        if (!publicRouteCache[service]) publicRouteCache[service] = {};
        publicRouteCache[service][method] = compiled;
    }

    return publicRouteCache[service][method].some(route =>
        route.regex.test(actualPath)
    );
};

export const getServiceFromPath = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[0] || '';
};
