import { NextFunction, Request, Response } from "express"
import { databaseInstance as Database } from "../database/mysql";
import sendErrorToClient from "../utilities/errorHandler";

const isOwnerOfDeck = async(req: Request, res: Response, next: NextFunction) =>{
    
    const queryString = `
        SELECT user_id as userId
        FROM decks
        WHERE deck_id = ?
    `    
    const values = [req.params.deckId]
    try{
        const connection = await Database.connect();
        const result =  await Database.processQuery(connection, queryString, values);
        
        //retrieve userId from request object, retrieve deckId from req.params
        const userId = req.userId;
        
        (result[0] && userId === result[0].userId) ? next() : res.sendStatus(401); 
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
    
}

export default isOwnerOfDeck;