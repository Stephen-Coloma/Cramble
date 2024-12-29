import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorHandler";
import { databaseInstance as Database } from "../../database/mysql";
import { Flashcard } from "../../dtos/Flashcard.dto";
import { Deck } from "../../dtos/Deck.dto";

const addFlashcardToDeckController = async(req: Request<{}, {}, Flashcard>, res: Response) =>{
    const deckId = (req.params as Deck).deckId;
    const front = req.body.front
    const back = req.body.back
    
    const queryString = `
        INSERT INTO flashcards(deck_id, front, back)
        VALUES(?,?,?)
    `

    const values = [deckId, front, back];

      try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);

        (result.affectedRows > 0) ? res.sendStatus(200).end() : res.sendStatus(400).end();   

      }catch(error: unknown){
        sendErrorToClient(error, res)
      }
}

export default addFlashcardToDeckController;