import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

export const addToCart = async (req, res) => {
    const { productId, quantity, selectedSize } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const sizeObj = product.sizes.find((s) => s.size === selectedSize);
        if (!sizeObj) {
            return res
                .status(400)
                .json({ message: "Selected size not available" });
        }

        const stockAvailable = sizeObj.stock;

        let cart = await Cart.findOne({ user: req.user.id });

        const maxAllowedQty = Math.min(quantity, stockAvailable, 5);

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                products: [
                    {
                        product: productId,
                        quantity: maxAllowedQty,
                        selectedSize,
                    },
                ],
            });
        } else {
            const productIndex = cart.products.findIndex(
                (item) =>
                    item.product.toString() === productId &&
                    item.selectedSize === selectedSize
            );

            if (productIndex > -1) {
                const currentQty = cart.products[productIndex].quantity;
                let newQty = currentQty + quantity;

                newQty = Math.max(1, newQty);

                if (newQty > stockAvailable) {
                    return res.status(400).json({
                        message: `Only ${stockAvailable} items available for size ${selectedSize}`,
                    });
                }

                cart.products[productIndex].quantity = Math.min(newQty, 5);
            } else {
                let qtyToAdd = Math.max(1, quantity);
                if (qtyToAdd > stockAvailable) {
                    return res.status(400).json({
                        message: `Only ${stockAvailable} items available for the size ${selectedSize}`,
                    });
                }

                qtyToAdd = Math.min(qtyToAdd, 5);

                cart.products.push({
                    product: productId,
                    quantity: qtyToAdd,
                    selectedSize,
                });
            }

            await cart.save();
        }

        await cart.populate("products.product");
        res.status(200).json({ cart });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
};

export const getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "products.product"
        );

        if (!cart) {
            return res.status(200).json({ cart: { products: [] } });
        }

        return res.status(200).json({ cart });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId, selectedSize } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }

        cart.products = cart.products.filter(
            (item) =>
                !(
                    item.product.toString() === productId &&
                    item.selectedSize === selectedSize
                )
        );

        await cart.save();
        await cart.populate("products.product");
        return res.status(200).json({ cart });
    } catch (err) {
        console.log(err.message);

        return res.status(500).json({ message: "internal server error" });
    }
};
