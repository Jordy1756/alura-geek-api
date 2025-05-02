import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./src/config/environment.js";
import { getConnection } from "./src/config/database.js";
import { createAPIRouter } from "./api.router.js";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

getConnection();

const app = express();
app.disable("x-powered-by");
app.use(
    cors({
        origin: "http://localhost:5501",
        credentials: true,
    })
);

app.use(json());
app.use(cookieParser());
app.use("/api", createAPIRouter());

app.use(errorMiddleware);
app.listen(PORT || 5000, () => console.log(`Running on http://localhost:${PORT || 5000}/api`));