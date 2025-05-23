import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config/index.js';

const router = express.Router();
const { services, environment } = config;
const { authService, userService, dashboardService, crmService, portalService } = services;

const createServiceProxy = (servicePath, target) => createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(`/api/${servicePath}`, ''),
    logLevel: environment === 'production' ? 'warn' : 'debug',
    onError: (err, req, res) => {
        console.error(`[Proxy Error] [${servicePath}]`, err.message);
        res.status(502).json({ error: `Proxy error for /api/${servicePath}` });
    },
    onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Forwarded-For', req.ip);
    },
    onProxyRes: (proxyRes, req) => {
        if (environment !== 'production') {
            console.log(`[Proxy Success] [${servicePath}] ${req.method} ${req.originalUrl} -> ${target}`);
        }
    },
    ws: true,
});

const routesMap = [
    { path: 'auth', target: authService },
    { path: 'users', target: userService },
    { path: 'dashboard', target: dashboardService },
    { path: 'crm', target: crmService },
    { path: 'portal', target: portalService },
]

routesMap.forEach(({ path, target }) => {
    router.use(`/${path}`, createServiceProxy(path, target));
});

export default router;
