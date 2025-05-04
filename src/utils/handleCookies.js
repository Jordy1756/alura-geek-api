import { NODE_ENV } from "../config/environment.js";

export const MAX_AGE_ACCESS_TOKEN_COOKIE = 5 * 60 * 1000;
export const MAX_AGE_REFRESH_TOKEN_COOKIE = 7 * 24 * 60 * 60 * 1000;

export const getTokenCookieConfig = (maxAge) => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge,
    sameSite: "none",
});
