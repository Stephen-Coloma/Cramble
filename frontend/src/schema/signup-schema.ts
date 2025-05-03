import Joi from "joi";

export const signupSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
        'string.empty': 'firstname is required',
        'string.max' : 'max 50 characters'
        }),

    lastName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'lastname is required',
            'string.max' : 'max 50 characters'
        }),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'username is required',
            'string.min': 'minimum 3 characters',
            'string.max' : 'max 30 characters'
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&\'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})'))
        .required()
        .messages({
            'string.pattern.base': "Atleast: | 1 uppercase letter | 1 lowercase letter | 1 number | 1 special character",
            'string.empty': 'password is required',
            'string.min': 'password must be at least 8 characters long',
            'string.max': 'max 100 characters'
        }), 

    email: Joi.string()
        .email({tlds: false})
        .required()
        .messages({
            'string.empty': 'email is required',
        })    
});