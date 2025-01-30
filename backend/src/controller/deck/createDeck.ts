import { Request, Response } from "express";
import { Deck } from "../../dtos/deck/Deck.dto";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient from "../../utilities/errorHandler";

const createDeckController = async(req: Request<{}, {}, Deck>, res: Response) =>{
    //get user id from the jwt token stored in req.userID
    const userId = req.userId;
    
    const title = req.body.title;
    const description = req.body.description;
    const createdAt = req.body.createdAt;
    const status = 'draft'; // initial status: draft. changes to active once user sends the flashcards for this deck

    const queryString = `
        INSERT INTO decks(user_id, title, description, created_at, status)
        VALUES (?, ?, ?, ?, ?)
    `

    const values = [userId, title, description, createdAt, status]

    try{
        const connection = await Database.connect();
        const result = await Database.processQuery(connection, queryString, values);

        // 201 created
        (result.affectedRows > 0) ? res.sendStatus(201).end() : res.sendStatus(400).end();   
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default createDeckController;