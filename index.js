import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { PORT } from "./src/config/environment.js";
import { getConnection } from "./src/config/database.js";
import { createAPIRouter } from "./api.router.js";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

getConnection();

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: "https://jordy1756.github.io/alura-geek", credentials: true }));

app.use(json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", createAPIRouter());
app.use(errorMiddleware);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT || 5000, () => console.log(`Running on http://localhost:${PORT || 5000}`));

console.log("aksjdn")
