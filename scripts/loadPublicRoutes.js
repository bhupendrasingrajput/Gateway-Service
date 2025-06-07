import redis from "../config/redis.js";

export const publicRoutesJSON = {
    auth: {
        GET: ['/auth'],
        POST: [
            '/auth/portal/send-otp',
            '/auth/portal/verify-otp',
            '/auth/dashboard/login'
        ]
    },
    portal: {
        GET: [
            '/portal',
            '/portal/city/all',
            '/portal/zone/all',
            '/portal/location/all',
            '/portal/builder/all',
            '/portal/builder/:id'
        ]
    },
    dashboard: {
        GET: ['/dashboard']
    },
    users: {
        GET: ['/users']
    }
};

export const loadPublicRoutesToRedis = async () => {
    const pipeline = redis.multi();

    for (const [service, methods] of Object.entries(publicRoutesJSON)) {
        for (const [method, paths] of Object.entries(methods)) {
            const key = `public:route:${service}:${method}`;
            pipeline.set(key, JSON.stringify(paths));
        }
    }

    await pipeline.exec();
    console.log('✅ Public routes loaded to Redis');
};