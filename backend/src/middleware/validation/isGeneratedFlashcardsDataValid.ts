import { NextFunction, Request, Response } from "express";
import validate from "../../utilities/inputValidator";
import { Flashcard } from "../../dtos/flashcard/Flashcard.dto";
import { Deck } from "../../dtos/deck/Deck.dto";
import sendErrorToClient from "../../utilities/errorHandler";
import { createDeckSchema as deckSchema } from "./isDeckDataValid";
import { addFlashcardToDeckSchema as flashcardSchema } from "./isFlashCardDataValid";


const isGeneratedFlashcardsDataValid = (req: Request, res: Response, next: NextFunction) => {
    try{
        const deck: Pick<Deck, 'title' | 'description' | 'createdAt' | 'editedAt'> = {
            title: req.body.title,
            description: req.body.description,
            createdAt: req.body.createdAt,
            editedAt: req.body.editedAt
        }
        const flashcards: Pick<Flashcard, 'front' | 'back'>[] = req.body.flashcards;

        //validating deck data
        const isDeckValid = validate(deck, deckSchema);
        
        if(isDeckValid === true){
            //validating flashcard data
            flashcards.forEach((flashcard: Pick<Flashcard, 'front' | 'back'>) => {
                const results = validate(flashcard, flashcardSchema);
                if(results !== true){
                    //automatically ends the call
                    res.sendStatus(400).json({message: "Error saving generated flashcards"});
                }
            });

            //deck data and flashcard data is good
            next();
        }else{
            console.log('here');
            
            res.status(400).json(isDeckValid).end();
        }  
    }catch(error: unknown){        
        sendErrorToClient(error, res);
    }
}

export default isGeneratedFlashcardsDataValid;