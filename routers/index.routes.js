import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config/index.js';

const router = express.Router();

// Service Routes Proxying
router.use('/auth', createProxyMiddleware({
    target: config.services.authService,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
}));

router.use('/users', createProxyMiddleware({
    target: config.services.userService,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
}));

router.use('/crm', createProxyMiddleware({
    target: config.services.crmService,
    changeOrigin: true,
    pathRewrite: { '^/api/crm': '' },
}));

router.use('/portal', createProxyMiddleware({
    target: config.services.portalService,
    changeOrigin: true,
    pathRewrite: { '^/api/portal': '' },
}));

export default router;
