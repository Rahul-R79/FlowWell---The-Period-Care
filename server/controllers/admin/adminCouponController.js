//adminCouponController
import Coupon from "../../models/Coupon.js";

/**
 * @function addCoupon
 * @description Creates a new coupon with validation for duplicates.
 * @expectedInput req.body: { couponName, couponCode, couponType, discountValue, expirationDate, minPurchaseAmount, maxDiscountAmount, usageLimit, firstOrderOnly }
 * @expectedOutput { coupon } or { errors: [{ field: "general", message: "Coupon already exist" }] }
 */
export const addCoupon = async (req, res) => {
    const {
        couponName,
        couponCode,
        couponType,
        discountValue,
        expirationDate,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        firstOrderOnly,
    } = req.body;

    try {
        const existingCoupon = await Coupon.findOne({
            $or: [{ couponName }, { couponCode }],
        });

        if (existingCoupon) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Coupon already exist" }],
            });
        }

        const newCoupon = await Coupon.create({
            couponName,
            couponCode,
            couponType,
            discountValue,
            expirationDate,
            minPurchaseAmount,
            maxDiscountAmount,
            usageLimit,
            firstOrderOnly,
        });

        return res.status(201).json({ coupon: newCoupon });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getCoupons
 * @description Retrieves paginated list of coupons with optional search filter.
 * @expectedInput req.query: { page, limit, search }
 * @expectedOutput { coupons, currentPage, totalPages, totalCoupons }
 */
export const getCoupons = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = {
            referral: { $exists: false },
            ...(search && {
                $or: [
                    { couponName: { $regex: search, $options: "i" } },
                    { couponCode: { $regex: search, $options: "i" } },
                ],
            }),
        };

        const totalCoupons = await Coupon.countDocuments(query);
        const totalPages = Math.ceil(totalCoupons / limit);

        const coupons = await Coupon.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.status(200).json({
            coupons,
            currentPage: page,
            totalPages,
            totalCoupons,
        });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getSingleCoupon
 * @description Retrieves a single coupon by ID.
 * @expectedInput req.params: { id }
 * @expectedOutput { coupon } or { message: "coupon not found" }
 */
export const getSingleCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ message: "coupon not found" });
        }

        res.status(200).json({ coupon });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function editCoupon
 * @description Updates an existing coupon by ID.
 * @expectedInput req.params: { id }, req.body: { couponName, couponCode, couponType, discountValue, expirationDate, minPurchaseAmount, maxDiscountAmount, usageLimit, firstOrderOnly }
 * @expectedOutput { coupon } or { errors: [{ field: "general", message: "Coupon already exists" }] }
 */
export const editCoupon = async (req, res) => {
    const { id } = req.params;
    const {
        couponName,
        couponCode,
        couponType,
        discountValue,
        expirationDate,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        firstOrderOnly,
    } = req.body;

    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: "coupon not found" });
        }
        const existingCoupon = await Coupon.findOne({
            $or: [{ couponName }, { couponCode }],
            _id: { $ne: id },
        });

        if (existingCoupon) {
            return res.status(400).json({
                errors: [
                    { field: "general", message: "Coupon already exists" },
                ],
            });
        }

        coupon.couponName = couponName;
        coupon.couponCode = couponCode;
        coupon.couponType = couponType;
        coupon.discountValue = discountValue;
        coupon.expirationDate = expirationDate;
        coupon.minPurchaseAmount = minPurchaseAmount;
        coupon.maxDiscountAmount = maxDiscountAmount;
        coupon.usageLimit = usageLimit;
        coupon.firstOrderOnly = firstOrderOnly;

        await coupon.save();

        res.status(200).json({ coupon });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function couponStatus
 * @description Toggles the active status of a coupon.
 * @expectedInput req.params: { id }
 * @expectedOutput { message: "status updated", coupon } or { message: "coupon not found" }
 */
export const couponStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ message: "coupon not found" });
        }

        const toggleStatus = !coupon.isActive;

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { $set: { isActive: toggleStatus } },
            { new: true }
        );

        res.status(200).json({
            message: "status updated",
            coupon: updatedCoupon,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
