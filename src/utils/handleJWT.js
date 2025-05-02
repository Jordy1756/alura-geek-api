import jwt from "jsonwebtoken";

import { REFRESH_SECRET_KEY, SECRET_KEY } from "../config/environment.js";

export const MAX_AGE_ACCESS_TOKEN_JWT = "5m";
export const MAX_AGE_REFRESH_TOKEN_JWT = "7d";

export const verifyToken = (token, key) => jwt.verify(token, key);

export const generateAccessToken = (paylod) => jwt.sign(paylod, SECRET_KEY, { expiresIn: MAX_AGE_ACCESS_TOKEN_JWT });

export const generateRefreshToken = (paylod) =>
    jwt.sign(paylod, REFRESH_SECRET_KEY, { expiresIn: MAX_AGE_REFRESH_TOKEN_JWT });
