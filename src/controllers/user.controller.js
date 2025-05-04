import User from "../models/User.js";
import { ConflictError, InternalServerError, ValidationError } from "../utils/errorHandler.js";
import {
    getTokenCookieConfig,
    MAX_AGE_ACCESS_TOKEN_COOKIE,
    MAX_AGE_REFRESH_TOKEN_COOKIE,
} from "../utils/handleCookies.js";
import { generateAccessToken, generateRefreshToken } from "../utils/handleJWT.js";
import { hashPassword, validateCredentials } from "../utils/handlePassword.js";

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser)
            throw new ConflictError("Correo en uso", "Ya existe una cuenta registrada con este correo electrónico");

        const hashedPassword = await hashPassword(password);

        const user = await User.create({ email, password: hashedPassword });

        return res.status(201).json(user);
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) throw new ValidationError("Credenciales incorrectas", "El correo o la contraseña son incorrectos");

        const isCredentialsValid = await validateCredentials(password, user.password);

        if (!isCredentialsValid)
            throw new ValidationError("Credenciales incorrectas", "El correo o la contraseña son incorrectos");

        const paylod = { id: user._id, email };

        res.cookie("access_token", generateAccessToken(paylod), getTokenCookieConfig(MAX_AGE_ACCESS_TOKEN_COOKIE));
        res.cookie("refresh_token", generateRefreshToken(paylod), getTokenCookieConfig(MAX_AGE_REFRESH_TOKEN_COOKIE));

        return res.status(201).json(user);
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            secure: NODE_ENV === "production",
            sameSite: "none",
            httpOnly: true,
        });

        res.clearCookie("refresh_token", {
            secure: NODE_ENV === "production",
            sameSite: "none",
            httpOnly: true,
        });

        res.status(201).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
        res.status(500).json({ name: error, message: error });
        // throw new InternalServerError("Error interno", "Error al cerrar sesión");
    }
};

export const getAuthStatus = (req, res) => {
    res.status(201).json({ isAuthenticated: Boolean(req.cookies.access_token) });
};
