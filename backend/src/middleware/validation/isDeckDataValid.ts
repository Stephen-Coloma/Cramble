import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Deck } from "../../dtos/Deck.dto";
import validate from "../../utilities/validate";

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

const isDeckDataValid = (req: Request<{}, {}, Deck>, res: Response, next: NextFunction) => {
    const deck: Pick<Deck, 'title' | 'description' | 'createdAt' | 'editedAt'> = {
        title: req.body.title,
        description: req.body.description,
        createdAt: req.body.createdAt,
        editedAt: req.body.editedAt
    }

    //validate        
    const results = validate(deck, createDeckSchema);
    if (results === true) {
        next();
    } else {
        res.status(400).json(results).end();
    }       
}

export default isDeckDataValid;