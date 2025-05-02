import mongoose from "mongoose";

export const generateObjectId = (id) => mongoose.Types.ObjectId.createFromHexString(id);
