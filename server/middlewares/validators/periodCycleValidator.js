import { body } from "express-validator";

export const validateCycle = [
    body("lastPeriodDate")
        .notEmpty()
        .withMessage("LastPeriodDate date is required")
        .bail()
        .isISO8601()
        .withMessage("LastPeriodDate date must be a valid date")
        .bail()
        .custom((value) => {
            const lastPeriodDate = new Date(value);
            const now = new Date();

            lastPeriodDate.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);

            if (lastPeriodDate > now) {
                throw new Error("LastPeriodDate must not be in the future");
            }
            return true;
        }),

    body("cycleLength")
        .notEmpty()
        .withMessage("CycleLength is required")
        .bail()
        .isInt({ min: 20, max: 40 })
        .withMessage("CycleLength must be in between 20 and 40 days"),
];
