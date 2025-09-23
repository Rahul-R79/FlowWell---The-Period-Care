//admin banner validator
import { body } from "express-validator";

export const validateBanner = [
    body("title")
        .notEmpty()
        .withMessage("Title is Required")
        .bail()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Title must contain only letters")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .trim(),
    body("subTitle")
        .notEmpty()
        .withMessage("SubTitle is Required")
        .bail()
        .isLength({ min: 5 })
        .withMessage("SubTitle must be at least 5 characters")
        .trim(),

    body("startingDate")
        .notEmpty()
        .withMessage("StartingDate is required")
        .bail()
        .isISO8601()
        .withMessage("StartingDate must be a valid date")
        .bail()
        .custom((value, { req }) => {
            const starting = new Date(value);
            const now = new Date();
            if (starting <= now) {
                throw new Error("StartingDate must be in the future");
            }

            if (req.body.endingDate) {
                const ending = new Date(req.body.endingDate);
                if (starting >= ending) {
                    throw new Error("StartingDate must be before EndingDate");
                }
            }

            return true;
        }),

    body("endingDate")
        .notEmpty()
        .withMessage("EndingDate is required")
        .bail()
        .isISO8601()
        .withMessage("EndingDate must be a valid date")
        .bail()
        .custom((value, { req }) => {
            const ending = new Date(value);
            const now = new Date();
            if (ending <= now) {
                throw new Error("EndingDate must be in the future");
            }

            if (req.body.startingDate) {
                const starting = new Date(req.body.startingDate);
                if (ending <= starting) {
                    throw new Error("EndingDate must be after StartingDate");
                }
            }

            return true;
        }),

    body("image").custom((_, { req }) => {
        if (!req.file) {
            throw new Error("Image is required");
        }
        return true;
    }),
];

export const validateEditBanner = [
    body("title")
        .notEmpty()
        .withMessage("Title is Required")
        .bail()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Title must contain only letters")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .trim(),
    body("subTitle")
        .notEmpty()
        .withMessage("SubTitle is Required")
        .bail()
        .isLength({ min: 5 })
        .withMessage("SubTitle must be at least 5 characters")
        .trim(),

    body("startingDate")
        .notEmpty()
        .withMessage("StartingDate is required")
        .bail()
        .isISO8601()
        .withMessage("StartingDate must be a valid date")
        .bail()
        .custom((value, { req }) => {
            const starting = new Date(value);
            if (req.body.endingDate) {
                const ending = new Date(req.body.endingDate);
                if (starting >= ending) {
                    throw new Error("StartingDate must be before EndingDate");
                }
            }

            return true;
        }),

    body("endingDate")
        .notEmpty()
        .withMessage("EndingDate is required")
        .bail()
        .isISO8601()
        .withMessage("EndingDate must be a valid date")
        .bail()
        .custom((value, { req }) => {
            const ending = new Date(value);
            if (req.body.startingDate) {
                const starting = new Date(req.body.startingDate);
                if (ending <= starting) {
                    throw new Error("EndingDate must be after StartingDate");
                }
            }

            return true;
        }),
];
