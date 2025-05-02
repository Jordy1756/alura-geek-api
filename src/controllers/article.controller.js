import Article from "../models/Article.js";
import Category from "../models/Category.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandler.js";
import { generateObjectId } from "../utils/handleMongooseTypes.js";

export const insertArticle = async (req, res) => {
    try {
        const { name, price, description, image, categories } = req.body;

        const categoriesCount = await Category.countDocuments({ _id: { $in: categories } });

        if (categoriesCount !== categories.length)
            throw new BadRequestError("Categorías inválidas", "Una o más categorías proporcionadas no existen");

        const article = await Article.create({ name, price, description, image, categories });

        res.status(201).json(article);
    } catch (error) {
        throw error;
    }
};

export const updateArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { name, price, description, image, categories } = req.body;

        const categoriesCount = await Category.countDocuments({ _id: { $in: categories } });

        if (categoriesCount !== categories.length)
            throw new BadRequestError("Categorías inválidas", "Una o más categorías proporcionadas no existen");

        const updatedArticle = await Article.findByIdAndUpdate(
            generateObjectId(articleId),
            { name, price, description, image, categories },
            { new: true }
        );

        if (!updatedArticle)
            throw new NotFoundError("Artículo no encontrado", "El artículo que intentas actualizar no existe");

        return res.status(200).json(updatedArticle);
    } catch (error) {
        throw error;
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        const deletedArticle = await Article.findByIdAndDelete(generateObjectId(articleId));

        if (!deletedArticle)
            throw new NotFoundError("Artículo no encontrado", "El artículo que intentas eliminar no existe");

        return res.status(200).json(deletedArticle);
    } catch (error) {
        throw error;
    }
};

export const getSomeArticles = async (req, res) => {
    try {
        const { categoryLimit, articlesLimit } = req.query;

        const randomCategories = await Category.aggregate([{ $sample: { size: parseInt(categoryLimit) } }]);

        const result = [];

        for (const category of randomCategories) {
            const randomArticles = await Article.aggregate([
                { $match: { categories: category._id } },
                { $sample: { size: parseInt(articlesLimit) } },
                { $addFields: { price: { $toDouble: "$price" } } },
            ]);

            if (randomArticles.length <= 0) continue;

            result.push({
                category: { id: category._id, name: category.name },
                articles: randomArticles,
            });
        }

        return res.status(200).json({ data: result });
    } catch (error) {
        throw error;
    }
};

export const getRecommendedArticles = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { categoryLimit, articlesLimit } = req.query;

        const currentArticle = await Article.findById(generateObjectId(articleId));

        const categoriesToProcess = currentArticle.categories.slice(0, parseInt(categoryLimit));

        const result = [];

        for (const categoryId of categoriesToProcess) {
            const category = await Category.findById(categoryId);

            if (!category) continue;

            const recommendedArticles = await Article.aggregate([
                {
                    $match: {
                        _id: { $ne: generateObjectId(articleId) },
                        categories: { $in: [categoryId] },
                    },
                },
                { $sample: { size: parseInt(articlesLimit) } },
                { $addFields: { price: { $toDouble: "$price" } } },
            ]);

            if (recommendedArticles.length <= 0) continue;

            result.push({
                category: { id: category._id, name: category.name },
                articles: recommendedArticles,
            });
        }

        return res.status(200).json({ data: result });
    } catch (error) {
        throw error;
    }
};

export const getAllArticles = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { articlesLimit } = req.query;

        const articles = await Article.aggregate([
            {
                $match: {
                    categories: { $in: [generateObjectId(categoryId)] },
                },
            },
            { $limit: parseInt(articlesLimit) },
            { $addFields: { price: { $toDouble: "$price" } } },
        ]);

        return res.status(200).json(articles);
    } catch (error) {
        throw error;
    }
};

export const searchArticles = async (req, res) => {
    try {
        const { query, articlesLimit } = req.query;

        const articles = await Article.aggregate([
            {
                $match: {
                    name: { $regex: query, $options: "i" },
                },
            },
            { $limit: parseInt(articlesLimit) },
            { $addFields: { price: { $toDouble: "$price" } } },
        ]);

        return res.status(200).json(articles);
    } catch (error) {
        throw error;
    }
};
