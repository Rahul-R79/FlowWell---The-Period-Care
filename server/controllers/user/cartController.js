import Cart from "../../models/Cart.js";

export const addToCart = async (req, res) => {
    const { productId, quantity, selectedSize } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            const qty = Math.min(quantity, 5);
            cart = await Cart.create({
                user: req.user.id,
                products: [{ product: productId, quantity: qty, selectedSize }],
            });
        } else {
            const productIndex = cart.products.findIndex(
                (item) =>
                    item.product.toString() === productId &&
                    item.selectedSize === selectedSize
            );

            if (productIndex > -1) {
                const currentQty = cart.products[productIndex].quantity;
                const newQty = currentQty + quantity;

                if (newQty > 5) {
                    cart.products[productIndex].quantity = 5;
                } else {
                    cart.products[productIndex].quantity = Math.max(1, newQty);
                }
            } else {
                cart.products.push({
                    product: productId,
                    quantity: Math.min(quantity, 5),
                    selectedSize,
                });
            }

            await cart.save();
        }
        await cart.populate("products.product");
        res.status(200).json({ cart });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
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
