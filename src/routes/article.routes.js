import { Router } from "express";
import {
    deleteArticle,
    getArticles,
    getRecommendedArticles,
    insertArticle,
    updateArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createArticleRouter = () => {
    const router = Router();

    router.post("", authMiddleware, insertArticle);
    router.put("/:articleId", authMiddleware, updateArticle);
    router.delete("/:articleId", authMiddleware, deleteArticle);
    router.get("", getArticles);
    router.get("/:articleId/recommended", getRecommendedArticles);

    return router;
};
