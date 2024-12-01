import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Deck } from "../../dtos/Deck.dto";

/* { 
    "title": "";
    "description": "";
    "createdAt": "";
}   
*/
const createDeckSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .required(),

    description: Joi.string()
        .min(3)
        .max(250)
        .required(),
 
    createdAt: Joi.string() //functional
        .isoDate(),

    editedAt: Joi.string() //functional
    .isoDate()
});

function validateDeckData(data: Deck): boolean | object{
    const { error } = createDeckSchema.validate(data, { abortEarly: false });

    // If there is an error, collect invalid fields and return them
    if (error) {
          // Collect all fields with error
          const invalidFields = error.details.map(detail => detail.path[0]);
          return {invalidFields};
    }

    // Validation passed
    return true;
}

const isDeckDataValid = (req: Request<{}, {}, Deck>, res: Response, next: NextFunction) => {
    const deck: Deck = {
        title: req.body.title,
        description: req.body.description,
        createdAt: req.body.createdAt,
        editedAt: req.body.editedAt,
    }

     //validate        
     const results = validateDeckData(deck);
     if(typeof results === 'boolean'){
         next()
     }else{
         res.status(400).json(results).end();
         // sendErrorToClient(results, res, 400);
     }    
}

export default isDeckDataValid;