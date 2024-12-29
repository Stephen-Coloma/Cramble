import { NextFunction, Request, Response } from "express";
import { UserSignUp } from "../../dtos/UserSignUp.dto";
import Joi from "joi";
import validate from "../../utilities/inputValidator";

/**
 * {
    "firstName": "",
    "lastName": "",
    "username": "",
    "password": "",
    "email": ""
    }
 */
const signupSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required(),
        

    lastName: Joi.string()
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

const isSignUpDataValid = (req: Request<{}, {}, UserSignUp>, res: Response, next: NextFunction) =>{
    const user: UserSignUp = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }
    
    //validate        
    const results = validate(user, signupSchema);
    if (results === true) {
        next();
    } else {
        res.status(400).json(results).end();
    }    
}

export default isSignUpDataValid;