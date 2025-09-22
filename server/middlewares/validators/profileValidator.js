import { body } from "express-validator";

export const validateProfile = [
    body("name")
        .notEmpty()
        .withMessage("Name is Required")
        .bail()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Name must contain only letters")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters")
        .trim(),

    body("phone")
        .optional()
        .isMobilePhone("en-IN")
        .withMessage("Invalid mobile number"),
];
