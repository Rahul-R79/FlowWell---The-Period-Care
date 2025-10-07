//adminProductController
import Product from "../../models/Product.js";
import cloudinary from "../../utils/cloudinary.js";

/**
 * @function addProduct
 * @description Adds a new product to the database with image uploads to Cloudinary.
 * @expectedInput
 * req.body: {
 *   name: string,
 *   description: string,
 *   basePrice: number,
 *   discountPrice: number,
 *   category: string,
 *   sizes: string[],
 *   offer: string
 * }
 * req.files: Array of image files (Buffer)
 *
 * @expectedOutput
 * Success (201): { product: { _id, name, description, images[], basePrice, discountPrice, category, sizes, offer } }
 * Error (400): { errors: [{ field: 'general', message: 'Product already exists' }] }
 */
export const addProduct = async (req, res) => {
    const {
        name,
        description,
        basePrice,
        discountPrice,
        category,
        sizes,
        offer,
    } = req.body;

    try {
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(400).json({
                errors: [
                    { field: "general", message: "Product already exists" },
                ],
            });
        }

        const imageUrls = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
            })
        );

        const product = await Product.create({
            name,
            description,
            images: imageUrls,
            basePrice,
            discountPrice,
            category,
            sizes,
            offer,
        });

        res.status(201).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function getProduct
 * @description Retrieves a paginated list of products with optional search by name.
 * @expectedInput
 * req.query: { page?: number, limit?: number, search?: string }
 *
 * @expectedOutput
 * Success (200): {
 *   products: Array,
 *   currentPage: number,
 *   totalPages: number,
 *   totalProducts: number
 * }
 * Error (500): { message: 'internal server error' }
 */
export const getProduct = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(query)
            .populate("category", "name")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            products,
            currentPage: page,
            totalPages,
            totalProducts,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function productStatus
 * @description Toggles the active/inactive status of a product.
 * @expectedInput
 * req.params: { id: string }
 *
 * @expectedOutput
 * Success (200): { message: "status updated", product: Object }
 * Error (404): { message: "product not found" }
 */
export const productStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        const toggleStatus = !product.isActive;

        const updateProduct = await Product.findByIdAndUpdate(
            id,
            { $set: { isActive: toggleStatus } },
            { new: true }
        );

        res.status(200).json({
            message: "status updated",
            product: updateProduct,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getSingleProductById
 * @description Retrieves a single product by its ID with populated category data.
 * @expectedInput
 * req.params: { id: string }
 *
 * @expectedOutput
 * Success (200): { product: Object }
 * Error (404): { message: "Product not found" }
 */
export const getSingleProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate("category", "name");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function updateProductById
 * @description Updates product details and optionally replaces its images.
 * @expectedInput
 * req.params: { id: string }
 * req.body: {
 *   name: string,
 *   description: string,
 *   basePrice: number,
 *   discountPrice: number,
 *   category: string,
 *   sizes: string[],
 *   offer: string
 * }
 * req.files: Array of image files (optional)
 *
 * @expectedOutput
 * Success (200): { product: Object }
 * Error (404): { message: "Product not found" }
 */
export const updateProductById = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        basePrice,
        discountPrice,
        category,
        sizes,
        offer,
    } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrls = product.images;
        if (req.files && req.files.length > 0) {
            imageUrls = await Promise.all(
                req.files.map(
                    (file) =>
                        new Promise((resolve, reject) => {
                            const uploadStream =
                                cloudinary.uploader.upload_stream(
                                    { folder: "products" },
                                    (err, result) =>
                                        err
                                            ? reject(err)
                                            : resolve(result.secure_url)
                                );
                            uploadStream.end(file.buffer);
                        })
                )
            );
        }

        product.name = name;
        product.description = description;
        product.basePrice = basePrice;
        product.discountPrice = discountPrice;
        product.category = category;
        product.sizes = sizes;
        product.offer = offer;
        product.images = imageUrls;

        await product.save();

        res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
