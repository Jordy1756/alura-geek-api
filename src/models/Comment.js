import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export default model("Comment", CommentSchema);
