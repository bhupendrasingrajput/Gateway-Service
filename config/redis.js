import { createClient } from 'redis';
import config from './index.js';

const { host, port, username, password } = config.redis;

const redis = createClient({
    socket: {
        host: host,
        port: Number(port),
        tls: true,
    },
    username,
    password,
});

redis.on('error', (err) => {
    console.error('🐞 Redis Client Error:', err);
});

export const connectRedis = async () => {
    try {
        if (redis.isOpen) return;
        await redis.connect();
        console.log('🔌 Connected to Redis (TLS)');
    } catch (err) {
        console.error('🐞 Redis connection failed', err);
        process.exit(1);
    }
};

export default redis;
