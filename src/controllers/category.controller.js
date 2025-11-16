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

export const getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(10, parseInt(limit));
        const skip = (pageNum - 1) * limitNum;

        const [categories, totalDocuments] = await Promise.all([
            Category.find().skip(skip).limit(limitNum),
            Category.countDocuments(),
        ]);

        const totalPages = Math.ceil(totalDocuments / limitNum);

        return res.status(200).json({
            data: categories,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: totalDocuments,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1,
            },
        });
    } catch (error) {
        throw error;
    }
};
