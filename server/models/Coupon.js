//coupon schema
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        couponName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        couponCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        minPurchaseAmount: {
            type: Number,
            default: 0,
        },
        maxDiscountAmount: {
            type: Number,
        },
        usageLimit: {
            type: Number,
            default: 1,
        },
        couponType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        firstOrderOnly: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        referral: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Referral'
        }
    },
    { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
