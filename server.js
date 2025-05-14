import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import proxy_routes from './routers/index.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import config from './config/index.js';

const app = express();

app.use('/api', proxy_routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Gateway Service is running.', timestamp: new Date().toLocaleDateString() });
});

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
