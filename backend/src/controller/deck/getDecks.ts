import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorhandler";
import { databaseInstance as Database } from "../../database/mysql";

const getDecksController = async (req: Request, res: Response) =>{
    //get user id from the jwt token stored in req.userID
    const userId = req.userId;

    const queryString = `
        SELECT deck_id as deckId, title, description, created_at as createdAt
        FROM decks 
        WHERE user_id = ? and status = 'active';
    `
    
    const values = [userId]

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);

        (results.length > 0) ? res.status(200).json(results) : res.status(200).json({message: 'empty'})
                
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default getDecksController;