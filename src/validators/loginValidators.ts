import {body} from "express-validator";


export const loginValidators = [
    body('loginOrEmail')
        .isString().withMessage('loginOrEmail must be a string')
        .notEmpty().withMessage('loginOrEmail is required'),
    body('password')
        .isString().withMessage('Password must be a string')
        .notEmpty().withMessage('Password is required'),
];