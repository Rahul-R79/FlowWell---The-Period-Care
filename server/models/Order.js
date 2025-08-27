import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        cartItems: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String }, 
                price: { type: Number}, 
                quantity: { type: Number, default: 1 },
                selectedSize: { type: String },
            },
        ],

        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 },
        total: { type: Number, required: true },

        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "RAZORPAY", "SIMPL", "CARD", "UPI", "WALLET"],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },

        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PLACED",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
