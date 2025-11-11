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

export const getArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoryId, q: query } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(10, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const matchConditions = {};

        if (categoryId) matchConditions.categories = { $in: [generateObjectId(categoryId)] };
        if (query) matchConditions.name = { $regex: query, $options: "i" };

        const [articles, totalDocuments] = await Promise.all([
            await Article.aggregate([
                { $match: matchConditions },
                { $skip: skip },
                { $limit: limitNum },
                { $addFields: { price: { $toDouble: "$price" } } },
            ]),
            await Article.countDocuments(matchConditions),
        ]);

        const totalPages = Math.ceil(totalDocuments / limitNum);

        return res.status(200).json({
            data: articles,
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

export const getRecommendedArticles = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Convertir a números y validar
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Buscar el artículo actual
        const currentArticle = await Article.findById(generateObjectId(articleId));

        if (!currentArticle) throw new NotFoundError("Artículo no encontrado", "El artículo base no existe");

        // Buscar artículos con categorías similares, excluyendo el actual
        const recommendedArticles = await Article.aggregate([
            {
                $match: {
                    _id: { $ne: generateObjectId(articleId) },
                    categories: { $in: currentArticle.categories },
                },
            },
            { $skip: skip },
            { $limit: limitNum },
            { $addFields: { price: { $toDouble: "$price" } } },
        ]);

        // Contar total de recomendaciones
        const totalDocuments = await Article.countDocuments({
            _id: { $ne: generateObjectId(articleId) },
            categories: { $in: currentArticle.categories },
        });
        const totalPages = Math.ceil(totalDocuments / limitNum);

        return res.status(200).json({
            data: recommendedArticles,
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