import { Router } from "express";
import { getAllCategories, insertCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createCategoryRouter = () => {
    const router = Router();

    router.post("/insert-category", insertCategory);
    router.get("/get-all-categories", authMiddleware, getAllCategories);

    return router;
};
