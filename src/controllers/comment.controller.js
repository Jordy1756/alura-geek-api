import Comment from "../models/Comment.js";

export const insertComment = async (req, res) => {
    try {
        const { name, message } = req.body;

        const comment = await Comment.create({ name, message });
        return res.status(201).json(comment);
    } catch (error) {
        throw error;
    }
};

export const getAllComments = async (req, res) => {
    try {
        return res.status(200).json(await Comment.find());
    } catch (error) {
        throw error;
    }
};
