import Category from "../models/Category.js";

export const insertCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = await Category.create({ name });
        return res.status(201).json(category);
    } catch (error) {
        throw error;
    }
};

export const getAllCategories = async (req, res) => {
    try {
        return res.status(200).json(await Category.find());
    } catch (error) {
        throw error;
    }
};
