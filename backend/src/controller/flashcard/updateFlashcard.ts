import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorHandler";
import { databaseInstance as Database } from "../../database/mysql";
import { Flashcard } from "../../dtos/flashcard/Flashcard.dto";
import { Deck } from "../../dtos/deck/Deck.dto";

const updateFlashcardController = async(req: Request<{}, {}, Flashcard>, res: Response) =>{
    const deckId = (req.params as Deck).deckId;
    const flashcardId = (req.params as Flashcard).flashcardId;
   
    const queryString = `
        UPDATE flashcards
        SET front = ?, back = ?
        WHERE flashcard_id = ? AND deck_id = ?
    `

    const values = [req.body.front, req.body.back, flashcardId, deckId];

      try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);

        (result.affectedRows > 0) ? res.sendStatus(200).end() : res.sendStatus(400);
      }catch(error: unknown){
        sendErrorToClient(error, res)
      }
}

export default updateFlashcardController;