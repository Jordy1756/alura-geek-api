import { REFRESH_SECRET_KEY, SECRET_KEY } from "../config/environment.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { getCreateTokenCookieOptions, MAX_AGE_ACCESS_TOKEN_COOKIE } from "../utils/handleCookies.js";
import { generateAccessToken, verifyToken } from "../utils/handleJWT.js";

export const authMiddleware = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    req.session = { user: null };

    try {
        if (!refreshToken)
            throw new UnauthorizedError(
                "Sesión inválida",
                "Tu sesión ha expirado. Por favor, inicia sesión nuevamente"
            );

        if (accessToken) {
            req.session = { user: verifyToken(accessToken, SECRET_KEY) };
            return next();
        }

        const user = verifyToken(refreshToken, REFRESH_SECRET_KEY);
        const paylod = { id: user.id, email: user.email };
        
        res.cookie(
            "access_token",
            generateAccessToken(paylod),
            getCreateTokenCookieOptions(MAX_AGE_ACCESS_TOKEN_COOKIE)
        );
        req.session = { user };
    } catch (error) {
        throw error;
    }

    next();
};
