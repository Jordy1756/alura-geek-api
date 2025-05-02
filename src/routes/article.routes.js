import { Router } from "express";
import {
    deleteArticle,
    getAllArticles,
    getRecommendedArticles,
    getSomeArticles,
    insertArticle,
    searchArticles,
    updateArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createArticleRouter = () => {
    const router = Router();

    router.post("/insert-article", authMiddleware, insertArticle);
    router.put("/update-article/:articleId", authMiddleware, updateArticle);
    router.delete("/delete-article/:articleId", authMiddleware, deleteArticle);
    router.get("/get-some-articles", getSomeArticles);
    router.get("/get-recommended-articles/:articleId", getRecommendedArticles);
    router.get("/get-all-articles/:categoryId", getAllArticles);
    router.get("/search-articles", searchArticles);
    // router.get("/get-some-articles/:categoryLimit/:articlesLimit", getSomeArticles);
    // router.get("/get-recommended-articles/:articleId/:categoryLimit/:articlesLimit", getRecommendedArticles);
    // router.get("/get-all-articles/:categoryId/:articlesLimit", getAllArticles);
    // router.get("/search-articles", searchArticles);

    return router;
};
