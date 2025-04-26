const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    services: {
        userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
        authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
        crmService: process.env.CRM_SERVICE_URL || 'http://localhost:3003',
        portalService: process.env.PORTAL_SERVICE_URL || 'http://localhost:3004',
    },
};

export default config;
