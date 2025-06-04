import dotenv from 'dotenv';
import fs from 'fs';

const envFilePath = '.env';

if (!fs.existsSync(envFilePath)) {
    console.error('🐞 Missing ".env" File. Application Can Not Start!');
    process.exit(1);
}

dotenv.config();

// Validate essential env variables
const requiredEnvVars = [
    // App
    'NODE_ENV',
    'PORT',
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.error(`🐞 Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}