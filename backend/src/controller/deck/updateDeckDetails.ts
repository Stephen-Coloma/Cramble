import { Request, Response } from "express";
import { Deck } from "../../dtos/Deck.dto";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient from "../../utilities/errorHandler";

const updateDeckDetailsController = async(req: Request<{}, {}, Deck>, res: Response) =>{
    //const retrieve userId from request
    const userId = req.userId;
    const deckId = (req.params as Deck).deckId;

    const queryString = `
        UPDATE decks
        SET title = ?, description = ?, edited_at = ?
        WHERE deck_id = ? AND user_id = ? 
    `

    const values = [req.body.title, req.body.description, req.body.editedAt, deckId, userId];

    try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);
        
        (result.affectedRows > 0) ? res.sendStatus(200).end() : res.sendStatus(400);
        
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default updateDeckDetailsController;