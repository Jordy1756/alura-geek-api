import { Router } from "express";
import { createUserRouter } from "./src/routes/user.routes.js";
import { createCategoryRouter } from "./src/routes/category.routes.js";
import { createArticleRouter } from "./src/routes/article.routes.js";
import { createCommmentRouter } from "./src/routes/comment.routes.js";

export const createAPIRouter = () => {
    const router = Router();

    router.use("/users", createUserRouter());
    router.use("/articles", createArticleRouter());
    router.use("/categories", createCategoryRouter());
    router.use("/comments", createCommmentRouter());

    return router;
};
