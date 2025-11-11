import { Router } from "express";
import { getCategories, insertCategory } from "../controllers/category.controller.js";

export const createCategoryRouter = () => {
    const router = Router();

    router.post("", insertCategory);
    router.get("", getCategories);

    return router;
};
