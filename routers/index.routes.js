import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config/index.js';

const router = express.Router();

const createServiceProxy = (servicePath, target) => createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(`/api/${servicePath}`, ''),
    logLevel: config.environment === 'production' ? 'warn' : 'debug',
    onError: (err, req, res) => {
        console.error(`[Proxy Error] [${servicePath}]`, err.message);
        res.status(502).json({ error: `Proxy error for /api/${servicePath}` });
    },
    onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Forwarded-For', req.ip);
    },
    onProxyRes: (proxyRes, req, res) => {
        if (config.environment !== 'production') {
            console.log(`[Proxy Success] [${servicePath}] ${req.method} ${req.originalUrl} -> ${target}`);
        }
    },
    ws: true,
});

router.use('/auth', createServiceProxy('auth', config.services.authService));
router.use('/users', createServiceProxy('users', config.services.userService));
router.use('/crm', createServiceProxy('crm', config.services.crmService));
router.use('/portal', createServiceProxy('portal', config.services.portalService));

export default router;
