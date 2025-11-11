import { Router } from "express";
import { getComments, insertComment } from "../controllers/comment.controller.js";

export const createCommmentRouter = () => {
    const router = Router();

    router.post("", insertComment);
    router.get("", getComments);

    return router;
};
