import { NextFunction, Request, Response } from "express";
import { UserSignUp } from "../../dtos/UserSignUp.dto";
import Joi from "joi";

/**
 * {
    "first_name": "",
    "last_name": "",
    "username": "",
    "password": "",
    "email": ""
    }
 */
const signupSchema = Joi.object({
    first_name: Joi.string()
        .min(1)
        .max(50)
        .required(),
        

    last_name: Joi.string()
        .min(1)
        .max(50)
        .required(),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&\'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})'))
        .required(),

    email: Joi.string()
        .email()
        .required()
});

function validateSignup(data: UserSignUp): boolean | object{
    const { error } = signupSchema.validate(data, { abortEarly: false });

    // If there is an error, collect invalid fields and return them
    if (error) {
        const invalidFields = error.details.map((detail) => detail.path[0]);        
        return { invalidFields };
    }

    // Validation passed
    return true;
}

const isSignUpDataValid = (req: Request<{}, {}, UserSignUp>, res: Response, next: NextFunction) =>{
    const user: UserSignUp = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }
    
    //validate        
    const results = validateSignup(user);
    if(typeof results === 'boolean'){
        next()
    }else{
        res.status(400).json(results).end();
        // sendErrorToClient(results, res, 400);
    }    
}

export default isSignUpDataValid;