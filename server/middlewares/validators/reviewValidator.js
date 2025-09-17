import { body } from "express-validator";

export const validateReview = [
    body("heading")
        .notEmpty()
        .withMessage("Review Title is Required")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Review Title must be at least 5 letters")
        .isLength({ max: 100 })
        .withMessage("Review Title cannot exceed 100 characters")
        .trim(),

    body("description")
        .notEmpty()
        .withMessage("Review Description is Required")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Review Description must be at least 5 letters")
        .isLength({ max: 1000 })
        .withMessage("Review Description cannot exceed 1000 characters")
        .trim(),

    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Select a rating star"),
];
