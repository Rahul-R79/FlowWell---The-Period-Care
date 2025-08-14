import {body} from 'express-validator';

export const validateCategory = [
    body('name')
        .notEmpty().withMessage('Category name is Required').bail()
        .matches(/^[A-Za-z\s]+$/).withMessage('Category name contain only letters')
        .isLength({min: 3}).withMessage('Category name must be at least 3 characters')
        .trim(),
    
    body('description')
        .notEmpty().withMessage('Category description is Required').bail()
        .isLength({min: 10}).withMessage('Category description must be at least 10 characters')
        .trim()
]