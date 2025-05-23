import { ApiError } from '../utils/ApiError.js';
import config from '../config/index.js';

const isDev = config.environment === 'development';

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(err instanceof ApiError)) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        error = new ApiError(statusCode, message);
    }

    console.error(`[ERROR] ${error.statusCode} - ${error.message}`, {
        path: req.originalUrl,
        method: req.method,
        ...(isDev && { stack: error.stack }),
    });

    const response = {
        success: false,
        message: error.message,
        ...(isDev && { stack: error.stack }),
    };

    res.status(error.statusCode).json(response);
};

export default errorHandler;