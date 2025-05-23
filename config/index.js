const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwt: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,

        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USER || '',
        password: process.env.REDIS_PASSWORD || '',
    },
    services: {
        userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
        authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
        dashboardService: process.env.DASHBOARD_SERVICE_URL || 'http://localhost:3003',
        crmService: process.env.CRM_SERVICE_URL || 'http://localhost:3004',
        portalService: process.env.PORTAL_SERVICE_URL || 'http://localhost:3005',
    },
    limiter: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60,
        max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    }
};

export default config;
