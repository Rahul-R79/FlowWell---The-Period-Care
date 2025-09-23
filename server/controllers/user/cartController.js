import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

//cart total calculation
const calculateTotals = (cart) => {
    let subtotal = 0;
    let discount = 0;

    cart.products.forEach(({ product, quantity }) => {
        const price = product.basePrice || 0;
        let itemDiscount =
            product.offer === "FLAT" ? price / 2 : product.discountPrice || 0;
        subtotal += price * quantity;
        discount += itemDiscount * quantity;
    });

    const deliveryFee = subtotal > 0 && subtotal < 500 ? 99 : 0;
    const total = subtotal + deliveryFee - discount;

    return { subtotal, discount, deliveryFee, total };
};

//add a product to the cart
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
        const totals = calculateTotals(cart);
        res.status(200).json({ cart, totals });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

//get the card products
export const getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "products.product"
        );

        if (!cart) {
            return res.status(200).json({ cart: { products: [], subtotal: 0, discount: 0, deliveryFee: 0, total: 0 } });
        }
        const totals = calculateTotals(cart);

        return res.status(200).json({ cart, totals });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//remove a product from the cart
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
        const totals = calculateTotals(cart)
        return res.status(200).json({ cart, totals });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
