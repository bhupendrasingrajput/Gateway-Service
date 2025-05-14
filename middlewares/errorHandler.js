import { ApiError } from '../utils/ApiError.js';
import config from '../config/index.js';

const errorHandler = (err, req, res, next) => {
    let error = err instanceof ApiError ? err : new ApiError(500, 'Internal Server Error');

    const response = {
        success: false,
        message: error.message || 'Something went wrong',
        ...(config.environment === 'development' && { stack: err.stack }),
    };

    console.error(`[ERROR] ${err.message}`, {
        path: req.originalUrl,
        method: req.method,
        ...(config.environment === 'development' && { stack: err.stack }),
    });

    res.status(error.statusCode).json(response);
};

export default errorHandler;
