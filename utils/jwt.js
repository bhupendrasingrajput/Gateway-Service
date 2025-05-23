import jwt from "jsonwebtoken";
import config from "../config/index.js";

const { accessTokenSecret, refreshTokenSecret } = config.jwt;

export function validateToken(token, type = 'access') {
    const secret = type === 'access' ? accessTokenSecret : refreshTokenSecret;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}