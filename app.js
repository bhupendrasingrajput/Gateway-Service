import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import errorHandler from './middlewares/errorHandler.js';
import { createRateLimiter } from './middlewares/rateLimiter.js';
import proxy_routes from './routers/index.routes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const startApp = async (redis) => {
    const app = express();

    app.use('/api', authMiddleware, proxy_routes);

    app.set('trust proxy', 1);

    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(createRateLimiter(redis));

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204
    }));

    app.get('/', (req, res) => {
        res.status(200).json({
            status: 'UP',
            message: 'Gateway Service is running.',
            timestamp: new Date().toLocaleDateString()
        });
    });

    app.use(errorHandler);

    return app;
}

export default startApp;