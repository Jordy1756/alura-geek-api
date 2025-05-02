import { InternalServerError, isCustomError } from "../utils/errorHandler.js";

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const { name, statusCode, message } = isCustomError(err) ? err : new InternalServerError();

    res.status(statusCode).json({ name, message });
};
