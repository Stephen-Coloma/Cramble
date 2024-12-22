import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Flashcard } from "../../dtos/Flashcard.dto";
import validate from "../../utilities/validate";

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

const isFlashcardDataValid = (req: Request<{}, {}, Flashcard>, res: Response, next: NextFunction) => {
    const flashcard: Pick<Flashcard, 'front' | 'back'> = {
        front: req.body.front,
        back: req.body.back
    }

    const results = validate(flashcard, addFlashcardToDeckSchema);
    if (results === true) {
        next();
    } else {
        res.status(400).json(results).end();
    }
}

export default isFlashcardDataValid;