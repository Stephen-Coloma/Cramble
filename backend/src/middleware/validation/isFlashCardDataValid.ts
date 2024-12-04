import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Flashcard } from "../../dtos/Flashcard.dto";

/* { 
    "front": "";
    "back": "";
}   
*/
const addFlashcardToDeckSchema = Joi.object({
    front: Joi.string()
        .min(1)
        .max(400)
        .required(),

    back: Joi.string()
        .min(1)
        .max(400)
        .required()
});

function validateFlashcardData(data: Pick<Flashcard, 'front' | 'back'>): boolean | object{
    const { error } = addFlashcardToDeckSchema.validate(data, { abortEarly: false });

    // If there is an error, collect invalid fields and return them
    if (error) {
          // Collect all fields with error
          const invalidFields = error.details.map(detail => detail.path[0]);
          return {invalidFields};
    }

    // Validation passed
    return true;
}

const isFlashcardDataValid = (req: Request<{}, {}, Flashcard>, res: Response, next: NextFunction) => {
    const flashcard: Pick<Flashcard, 'front' | 'back'> = {
        front: req.body.front,
        back: req.body.back
    }

     //validate        
     const results = validateFlashcardData(flashcard);
     if(typeof results === 'boolean'){
         next()
     }else{
         res.status(400).json(results).end();
         // sendErrorToClient(results, res, 400);
     }    
}

export default isFlashcardDataValid;