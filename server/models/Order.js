import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderNumber: { type: String, unique: true, required: true },

        cartItems: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: { type: Number, default: 1 },
                selectedSize: String,
                image: String,

                status: {
                    type: String,
                    enum: [
                        "PLACED",
                        "SHIPPED",
                        "OUT FOR DELIVERY",
                        "CANCELLED",
                        "DELIVERED",
                        "RETURNED",
                        "REFUNDED",
                    ],
                    default: "PLACED",
                },

                cancelReason: String,
                cancelledAt: Date,

                returnReason: String,
                returnedAt: Date,

                statusHistory: [
                    {
                        status: {
                            type: String,
                            enum: [
                                "PLACED",
                                "SHIPPED",
                                "OUT FOR DELIVERY",
                                "DELIVERED",
                                "CANCELLED",
                                "RETURNED",
                                "REFUNDED",
                            ],
                        },
                        date: { type: Date, default: Date.now },
                        reason: String,
                    },
                ],
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
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "SHIPPED",
                "DELIVERED",
                "OUT FOR DELIVERY",
                "CANCELLED",
                "RETURNED",
                "REFUNDED",
            ],
            default: "PLACED",
        },
        couponDiscount: {
            type: Number,
            default: 0
        },
        appliedCoupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
        },

        expectedDelivery: Date,
        deliveredAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
