import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routers/index.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import config from './config/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Gateway Service is running.', timestamp: new Date().toLocaleDateString(), })
});

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorHandler);

// Server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
