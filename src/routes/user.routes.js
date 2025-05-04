import { Router } from "express";
import { getAuthStatus, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createUserRouter = () => {
    const router = Router();

    router.post("/register-user", registerUser);
    router.post("/login-user", loginUser);
    router.post("/logout-user", logoutUser);
    router.post("/get-auth-status", authMiddleware, getAuthStatus);

    return router;
};
