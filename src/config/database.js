import { connect } from "mongoose";
import { CONNECTION_STRING_DB } from "./environment.js";

export const getConnection = async () => {
    try {
        await connect(CONNECTION_STRING_DB);
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting the database", error);
    }
};
