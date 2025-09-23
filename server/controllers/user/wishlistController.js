import Wishlist from "../../models/Wishlist.js";

//add a product to wishlist
export const addToWishlist = async (req, res) => {
    const { productId, selectedSize } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                products: [{ product: productId, selectedSize }],
            });
        } else {
            const exists = wishlist.products.some(
                (p) => p.product.toString() === productId
            );

            if (!exists) {
                wishlist.products.unshift({ product: productId, selectedSize });
                await wishlist.save();
            }
        }

        res.status(200).json({ wishlist });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get the product from the wishlist
export const getWishlist = async (req, res) => {
    try {
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
            "products.product"
        );

        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p) => p.product?.isActive
            );
        }

        if (!wishlist) {
            return res.status(200).json({ wishlist: { products: [] } });
        }

        const totalWishlist = wishlist.products.length;
        const totalPages = Math.ceil(totalWishlist / limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = wishlist.products.slice(startIndex, endIndex);

        res.status(200).json({
            wishlist: {
                _id: wishlist._id,
                user: wishlist.user,
                products: paginatedProducts,
            },
            totalWishlist,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//remove from the wishlist
export const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    let { page = 1, limit = 3 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (item) => !(item.product.toString() === productId)
        );
        await wishlist.save();
        await wishlist.populate("products.product");

        const totalWishlist = wishlist.products.length;
        const totalPages = Math.ceil(totalWishlist / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = wishlist.products.slice(startIndex, endIndex);

        res.status(200).json({
            wishlist: {
                _id: wishlist._id,
                user: wishlist.user,
                products: paginatedProducts,
            },
            totalWishlist,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
