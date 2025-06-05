import { createClient } from 'redis';
import config from './index.js';

const { host, port, username, password } = config.redis;

const redis = createClient({
    socket: {
        host: host,
        port: Number(port),
        tls: true,
        connectTimeout: 10000
    },
    username,
    password,
});


redis.on('error', (err) => {
    console.error('🐞 Redis Client Error:', err);
});

export const connectRedis = async () => {
    try {
        if (!redis.isOpen) {
            await redis.connect();
            console.log('🔌 Redis connection established!');
        }

        setInterval(async () => {
            if (redis.isOpen) {
                try {
                    await redis.ping();
                    console.log('💓 Redis keep-alive ping.');
                } catch (err) {
                    console.warn('⚠️ Redis ping failed:', err.message);
                }
            }
        }, 240_000);

    } catch (err) {
        console.error('❌ Redis connection failed:', err);
        process.exit(1);
    }
};


export default redis;
