import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorhandler";
import { databaseInstance as Database } from "../../database/mysql";
import { Deck } from "../../dtos/Deck.dto";

const getAllDecksController = async (req: Request, res: Response<Deck>) =>{
    //get user id from the jwt token stored in req.userID
    const userId = req.userId;

    const queryString = `
        SELECT deck_id as deckId, title, description, created_at as createdAt
        FROM decks 
        WHERE user_id = ?;
    `
    
    const values = [userId]

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values)
        
        res.status(200).json(results)
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default getAllDecksController;