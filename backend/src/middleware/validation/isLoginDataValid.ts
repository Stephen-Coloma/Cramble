import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserLogin } from "../../dtos/user/UserLogin.dto";
import validate from "../../utilities/inputValidator";

/**
 * {
    "username": "",
    "password": "",
    }
 */
const loginSchema = Joi.object({
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
});

const isLoginDataValid = (req: Request<{}, {}, UserLogin>, res: Response, next: NextFunction) =>{
    const user: UserLogin = {
        username: req.body.username,
        password: req.body.password,
    }
       
    //validate        
    const results = validate(user, loginSchema);
    if (results === true) {
        next();
    } else {
        res.status(400).json(results).end();
    }   
}

export default isLoginDataValid;