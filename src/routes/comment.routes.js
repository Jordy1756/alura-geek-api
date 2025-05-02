import { Router } from "express";
import { getAllComments, insertComment } from "../controllers/comment.controller.js";

export const createCommmentRouter = () => {
    const router = Router();

    router.post("/insert-comment", insertComment);
    router.get("/get-all-comments", getAllComments);

    return router;
};
