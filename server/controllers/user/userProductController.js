//userProductController
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

/**
 * @function getAllProducts
 * @description Retrieves all active products with optional filters (size, price, category, offer) and sorting. Supports pagination.
 * @expectedInput req.query: { page?, limit?, sortBy?, size?, price?, categoryName?, offer? }
 * @expectedOutput { products: [...], currentPage, totalPages, totalProducts } or { message: "internal server error" }
 */
export const getAllProducts = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 9,
            sortBy,
            size,
            price,
            categoryName,
            offer,
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let filter = { isActive: true };

        //size filter
        if (size) {
            const sizes = size.split(",");
            filter["sizes.size"] = { $in: sizes };
        }

        // price filter
        if (price) {
            switch (price) {
                case "under500":
                    filter.basePrice = { $lt: 500 };
                    break;
                case "500to1000":
                    filter.basePrice = { $gte: 500, $lte: 1000 };
                    break;
                case "1000to2500":
                    filter.basePrice = { $gte: 1000, $lte: 2500 };
                    break;
                case "above2500":
                    filter.basePrice = { $gt: 2500 };
                    break;
            }
        }

        //offer filter
        if (offer) {
            const offers = offer.split(",");
            filter.offer = { $in: offers };
        }

        //category
        if (categoryName) {
            const category = await Category.findOne({
                name: categoryName.trim(),
            });

            if (category) {
                filter.category = category._id;
            } else {
                return res.status(200).json({ products: [] });
            }
        }

        //sortBy
        let sortOption = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceLowToHigh":
                    sortOption.basePrice = 1;
                    break;
                case "priceHighToLow":
                    sortOption.basePrice = -1;
                    break;
                case "aToZ":
                    sortOption.name = 1;
                    break;
                case "zToA":
                    sortOption.name = -1;
                    break;
                case "newArrivals":
                    sortOption.createdAt = -1;
                    break;
            }
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)
            .populate("category")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortOption)
            .lean();

        const modifiedProducts = products.map((product) => {
            let finalPrice = product.basePrice;

            if (product.discountPrice && product.discountPrice > 0) {
                finalPrice = product.basePrice - product.discountPrice;
            }

            if (product.offer === "FLAT") {
                finalPrice = product.basePrice * 0.5;
            }

            return {
                ...product,
                basePrice: product.basePrice,
                finalPrice,
            };
        });

        return res
            .status(200)
            .json({
                products: modifiedProducts,
                currentPage: page,
                totalPages,
                totalProducts,
            });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getProductById
 * @description Retrieves a single product by its ID along with 4 similar products from the same category.
 * @expectedInput req.params: { id }
 * @expectedOutput { product, similarProduct } or { message: "product not found" } or { message: "internal server error" }
 */
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById({
            _id: id,
            isActive: true,
        }).lean();

        const similarProduct = await Product.find({
            category: product.category,
            _id: { $ne: id },
            isActive: true,
        })
            .limit(4)
            .lean();

        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        return res.status(200).json({ product, similarProduct });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function searchProduct
 * @description Searches products by name (case-insensitive, partial matches). Returns a maximum of 5 results.
 * @expectedInput req.query: { q }
 * @expectedOutput { products: [...] } or { message: "internal server error" }
 */
export const searchProduct = async (req, res) => {
    const { q } = req.query;

    try {
        if (!q || q.trim() === "") {
            return res.status(200).json({ products: [] });
        }

        const products = await Product.find({
            name: { $regex: q, $options: "i" },
            isActive: true,
        })
            .select("_id name images")
            .limit(5);

        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
