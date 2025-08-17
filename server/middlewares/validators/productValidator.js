import { body } from "express-validator";

export const parseFormData = (req, res, next) => {
    try {
        if (req.body.sizes && typeof req.body.sizes === "string") {
            req.body.sizes = JSON.parse(req.body.sizes);
        }

        if (req.body.basePrice)
            req.body.basePrice = parseFloat(req.body.basePrice);

        if (req.body.discountPrice)
            req.body.discountPrice = parseFloat(req.body.discountPrice);

        if (req.body.sizes && Array.isArray(req.body.sizes)) {
            req.body.sizes = req.body.sizes.map((item) => ({
                size: item.size,
                stock:
                    item.stock !== undefined
                        ? parseInt(item.stock)
                        : item.stock,
            }));
        }

        req.body.images = req.files && req.files.length > 0 ? "hasFiles" : "";

        next();
    } catch (err) {
        return res.status(400).json({
            errors: [
                { field: "formData", message: "Invalid form data format" },
            ],
        });
    }
};

export const validateProduct = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Product name must be at least 3 characters")
        .trim(),

    body("description")
        .notEmpty()
        .withMessage("Product description is required")
        .bail()
        .isLength({ min: 10 })
        .withMessage("Product description must be at least 10 characters")
        .trim(),

    body("images").notEmpty().withMessage("Atleast one image is required"),

    body("basePrice")
        .notEmpty()
        .withMessage("Base price is required")
        .bail()
        .isFloat({ gt: 0 })
        .withMessage("Base price must be a number greater than 0"),

    body("discountPrice")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Discount price must be a number greater than or equal to 0"
        )
        .custom((value, { req }) => {
            if (value > req.body.basePrice) {
                throw new Error("Discount price cannot exceed base price");
            }
            return true;
        }),

    body("category").notEmpty().withMessage("Category is required"),

    body("sizes").custom((sizes) => {
        const sizeSet = new Set();
        for (let item of sizes) {
            if (!item.size) continue;
            if (sizeSet.has(item.size)) {
                throw new Error("The size is already added");
            }
            sizeSet.add(item.size);
        }
        return true;
    }),

    body("sizes.*.size").notEmpty().withMessage("Size is required"),

    body("sizes.*.stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];
