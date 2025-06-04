import redis from "../config/redis.js";

const publicRouteEntries = [
    // auth service 
    ['GET:/auth', 1],
    ['POST:/auth/portal/send-otp', 1],
    ['POST:/auth/portal/verify-otp', 1],
    ['POST:/auth/dashboard/login', 1],

    // portal service
    ['GET:/portal', 1],

    // dashboard service
    ['GET:/dashboard', 1],

    // users service
    ['GET:/users', 1],
];

export const loadPublicRoutes = async () => {
    try {
        await redis.del('public:route');
        const commands = publicRouteEntries.flatMap(([key, val]) => [key, val]);
        await redis.hSet('public:route', commands);
    } catch (error) {
        console.log('Error Loading Public Routes \n', error);
        process.exit(1);
    }
};
