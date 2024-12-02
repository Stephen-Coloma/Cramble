import { Request, Response } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient from "../../utilities/errorhandler";

const deleteDeckController = async(req: Request, res: Response) =>{
    const queryString = `
        UPDATE decks
        SET status = 'deleted'
        WHERE deck_id = ? AND user_id = ?
    `

    const values = [req.params.deckId, req.userId]
    try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);
        
        (result.affectedRows > 0) ? res.sendStatus(200).end() : res.sendStatus(400).end();

    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default deleteDeckController;