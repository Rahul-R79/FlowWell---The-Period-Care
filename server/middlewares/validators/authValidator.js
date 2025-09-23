//auth validator
import { body } from "express-validator";

export const validateSignUp = [
    body('name')
    .notEmpty().withMessage('Name is Required').bail()
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters')
    .isLength({min: 3}).withMessage('Name must be at least 3 characters')
    .trim(),

    body('email')
    .notEmpty().withMessage('Email is Required').bail()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({min: 6}).withMessage('Password must be at least 6 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character'),

    body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is Required').bail()
    .custom((pass, {req})=>{
        if(pass !== req.body.password){
            throw new Error('Password is not Matching')
        }
        return true
    })
]

export const validateSignIn = [
    body('email')
    .notEmpty().withMessage('Email is Required').bail()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({min: 6}).withMessage('Password must be at least 6 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character'),
]

export const validateEmail = [
    body('email')
    .notEmpty().withMessage('Email is Required').bail()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

]
export const validateforResetPass = [
    body('newPassword')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({min: 6}).withMessage('Password must be at least 6 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character'),

    body('newConfirmPassword')
    .notEmpty().withMessage('Confirm Password is Required').bail()
    .custom((pass, {req})=>{
        if(pass !== req.body.newPassword){
            throw new Error('Password is not Matching');
        }
        return true;
    })
]

export const validateAdminSignIn = [
    body('email')
    .notEmpty().withMessage('Email is Required').bail()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character')
];


export const validateChangePassword = [
    body('oldPassword')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('newPassword')
    .notEmpty().withMessage('Password is Required').bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character')
]