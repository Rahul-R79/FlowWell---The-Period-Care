import Coupon from "../../models/Coupon.js";
import Order from "../../models/Order.js";
import Referral from "../../models/Referral.js";

export const getUserCoupon = async (req, res) => {
    const cartTotal = req.query.cartTotal ? parseFloat(req.query.cartTotal) : 0;

    try {
        const hasOrdered = await Order.exists({
            user: req.user.id,
            orderStatus: { $nin: ["CANCELLED", "REFUNDED"] },
        });

        const coupons = await Coupon.find({
            isActive: true,
            expirationDate: { $gte: new Date() },
            minPurchaseAmount: { $lte: cartTotal },
            $or: [
                { firstOrderOnly: false },
                {
                    firstOrderOnly: true,
                    $expr: { $eq: [hasOrdered ? 1 : 0, 0] },
                },
            ],
        }).populate("referral");

        const filteredCoupons = coupons.filter((coupon) => {
            if (coupon.referral) {
                return coupon.referral.generatedUser.toString() === req.user.id;
            }
            return true;
        });

        res.status(200).json({ coupons: filteredCoupons });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

export const applyCoupon = async (req, res) => {
    const { couponCode, cartTotal } = req.body;

    try {
        const coupon = await Coupon.findOne({ couponCode });

        if (!coupon) {
            return res.status(404).json({ message: "coupon not found" });
        }

        let discountAmount = 0;
        if (coupon.couponType === "percentage") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(
                    discountAmount,
                    coupon.maxDiscountAmount
                );
            }
        } else if (coupon.couponType === "fixed") {
            discountAmount = coupon.discountValue;
        }

        if (coupon.referral) {
            const referral = await Referral.findById(coupon.referral);

            if (referral && !referral.isClaimed) {
                referral.isClaimed = true;
                await referral.save();
            }
        }

        res.status(200).json({
            _id: coupon._id,
            couponCode: coupon.couponCode,
            discountAmount,
        });
    } catch (err) {
        return res.status(500).json({ message: "ineternal server error" });
    }
};
