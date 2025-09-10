import { body } from "express-validator";

export const validateCoupon = [
    body("couponName")
        .notEmpty()
        .withMessage("Coupon name is Required")
        .bail()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Coupon name contain only letters")
        .isLength({ min: 5 })
        .withMessage("Coupon name must be at least 5 characters")
        .trim(),

    body("couponCode")
        .notEmpty()
        .withMessage("Coupon code is required")
        .bail()
        .isLength({ min: 6, max: 20 })
        .withMessage("Coupon code must be between 6 and 20 characters")
        .bail()
        .matches(/^[A-Z0-9]+$/)
        .withMessage(
            "Coupon code must contain only uppercase letters and numbers"
        )
        .trim(),

    body("couponType")
        .notEmpty()
        .withMessage("Coupon type is required")
        .bail()
        .isIn(["percentage", "fixed"])
        .withMessage('Coupon type must be either "percentage" or "fixed"')
        .trim(),

    body("discountValue")
        .notEmpty()
        .withMessage("Discount value is required")
        .bail()
        .isFloat({ gt: 1 })
        .withMessage("Discount value must be a positive number")
        .trim(),

    body("minPurchaseAmount")
        .optional()
        .isFloat({ min: 1 })
        .withMessage(
            "Minimum Purchase Amount must be a number and greater than 0"
        )
        .trim(),

    body("maxDiscountAmount")
        .optional()
        .isFloat({ min: 1 })
        .withMessage(
            "Maximum Discount Amount must be a number and greater than 0"
        )
        .custom((value, { req }) => {
            if (req.body.couponType === "fixed" && value) {
                throw new Error(
                    "Max Discount Amount should only be set for percentage coupons"
                );
            }
            return true;
        })
        .trim(),

    body("usageLimit")
        .notEmpty()
        .withMessage("Usage Limit is required")
        .isInt({ min: 1 })
        .withMessage("Usage Limit must be a positive number")
        .trim(),

    body("expirationDate")
        .notEmpty()
        .withMessage("Expiration date is required")
        .bail()
        .isISO8601()
        .withMessage("Expiration date must be a valid date")
        .bail()
        .custom((value) => {
            const expiration = new Date(value);
            const now = new Date();
            if (expiration <= now) {
                throw new Error("Expiration date must be in the future");
            }
            return true;
        }),
];
