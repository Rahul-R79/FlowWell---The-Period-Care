import { body } from "express-validator";

export const validateProduct = [
    body('name')
        .notEmpty().withMessage('Product name is Required').bail()
        .isLength({min: 3}).withMessage('Product name must be at least 3 characters')
        .trim(),

    body('description')
        .notEmpty().withMessage('Product description is Required').bail()
        .isLength({min: 10}).withMessage('Product description must be at least 10 characters')
        .trim(),

    body("images")
        .isArray({ min: 1 })
        .withMessage("At least one product image is required"),

    body("basePrice")
        .notEmpty().withMessage("Base price is required").bail()
        .isFloat({ gt: 0 })
        .withMessage("Base price must be a number greater than 0"),

    body("discountPrice")
        .optional({checkFalsy: true})
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a number greater than or equal to 0")
        .custom((value, { req }) => {
            if (value > req.body.basePrice) {
                throw new Error("Discount price cannot exceed base price");
            }
            return true;
        }),
    
    body("category")
        .notEmpty().withMessage("Category is required"),
    
    body("sizes")
        .custom((sizes)=>{
            const sizeSet = new Set();
            for(let item of sizes){
                if(sizeSet.has(item.size)){
                    throw new Error('The size is already added');
                }
                sizeSet.add(item.size);
            }
            return true
        }),
    
    body("sizes.*.stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
]

