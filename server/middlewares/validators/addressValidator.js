import { body } from "express-validator";

export const validateAddress = [
    body('fullName')
    .notEmpty().withMessage('Name is Required').bail()
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters')
    .isLength({min: 3}).withMessage('Name must be at least 3 characters')
    .trim(),

    body('phone')
    .notEmpty().withMessage('Mobile number is Required').bail()
    .isMobilePhone('en-IN').withMessage('Invalid mobile number'),

    body('pincode')
    .notEmpty().withMessage('Pincode is Required').bail()
    .matches(/^[1-9][0-9]{5}$/).withMessage('Invalid pincode'),

    body('locality')
    .notEmpty().withMessage('Locality is Required').bail()
    .isLength({ min: 3 }).withMessage('Locality must be at least 3 characters')
    .trim(),

    body('streetAddress')
    .notEmpty().withMessage('Street Address is Required').bail()
    .isLength({ min: 5 }).withMessage('Street Address must be at least 5 characters')
    .trim(),

    body('city')
    .notEmpty().withMessage('City is Required').bail()
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters')
    .trim(),

    body('state')
    .notEmpty().withMessage('State is Required').bail()
    .isLength({ min: 3 }).withMessage('State must be at least 3 characters')
    .trim(),

    body('landmark')
    .optional({checkFalsy: true})
    .isLength({ min: 3 }).withMessage('Landmark must be at least 3 characters if provided')
    .trim(),

    body('alternatePhone')
    .optional({checkFalsy: true})
    .isMobilePhone('en-IN').withMessage('Invalid alternate mobile number'),
]