import { Router } from "express";
import { getAuthStatus, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createUserRouter = () => {
    const router = Router();

    router.post("", registerUser);
    router.post("/session", loginUser);
    router.delete("/session", authMiddleware, logoutUser);
    router.get("/me", authMiddleware, getAuthStatus);

    return router;
};
