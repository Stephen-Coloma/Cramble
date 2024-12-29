import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorHandler";
import { databaseInstance as Database } from "../../database/mysql";
import { Flashcard } from "../../dtos/Flashcard.dto";

const getFlashcardsController = async(req: Request, res: Response) =>{
    const deckId = req.params.deckId;

    const queryString = `
        SELECT * 
        FROM flashcards 
        WHERE deck_id = ?;
    `

    const values = [deckId];

      try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);

        const flashcards: Flashcard[] = result.map((item : any) => {            
            const flashcard: Flashcard = {
                flashcardId: item.flashcard_id,
                deckId: item.deck_id,
                front: item.front,
                back: item.back,
                mastery: item.mastery
            }

            return flashcard;
        });
                                
        (flashcards.length > 0) ? res.status(200).json(flashcards).end() : res.status(200).json({message: 'empty'}).end();
      }catch(error: unknown){
        sendErrorToClient(error, res)
      }
}

export default getFlashcardsController;