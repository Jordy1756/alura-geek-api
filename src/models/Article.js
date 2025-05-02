import { Schema, model } from "mongoose";

const ArticleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Schema.Types.Decimal128,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },
        ],
    },
    {
        versionKey: false,
    }
);

export default model("Article", ArticleSchema);
