import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserLogin } from "../../dtos/UserLogin.dto";

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

function validateLogin(data: UserLogin): boolean | object{
    const { error } = loginSchema.validate(data, { abortEarly: false });

    // If there is an error, collect invalid fields and return them
    if (error) {
          // Collect all fields with error
          const invalidFields = error!.details.map(detail => detail.path[0]);
          return {invalidFields};
    }

    // Validation passed
    return true;
}

const isLoginDataValid = (req: Request<{}, {}, UserLogin>, res: Response, next: NextFunction) =>{
    const user: UserLogin = {
        username: req.body.username,
        password: req.body.password,
    }
       
    //validate        
    const results = validateLogin(user);
    if(typeof results === 'boolean'){
        next()
    }else{
        res.status(400).json(results).end();
        // sendErrorToClient(results, res, 400);
    }    
}

export default isLoginDataValid;