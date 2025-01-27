import { Request, Response } from "express";
import sendErrorToClient from "../../utilities/errorHandler";
import { databaseInstance as Database } from "../../database/mysql";

const getDecksController = async (req: Request, res: Response) =>{
    //get user id from the jwt token stored in req.userID
    const userId = req.userId;

    // const queryString = `
    //     SELECT deck_id as deckId, title, description, created_at as createdAt, edited_at editedAt
    //     FROM decks 
    //     WHERE user_id = ? and status = 'active';
    // `

    //it also totals the flashcards count, number of unsure, familiar, mastered and unrated in the flashcards table
    const queryString = `
         SELECT 
            decks.deck_id AS deckId,
            title,
            description,
            created_at AS createdAt,
            edited_at AS editedAt,
            COUNT(flashcard_id) AS totalCards,
            CAST(SUM(CASE WHEN flashcards.mastery = 'unsure' THEN 1 ELSE 0 END) AS SIGNED) AS unsureTotal,
          	CAST(SUM(CASE WHEN flashcards.mastery = 'familiar' THEN 1 ELSE 0 END) AS SIGNED) AS familiarTotal,
          	CAST(SUM(CASE WHEN flashcards.mastery = 'mastered' THEN 1 ELSE 0 END) AS SIGNED) AS masteredTotal,
          	CAST(SUM(CASE WHEN flashcards.mastery = 'unrated' THEN 1 ELSE 0 END) AS SIGNED) AS unratedTotal
        FROM 
            decks
        INNER JOIN 
            flashcards ON decks.deck_id = flashcards.deck_id
        WHERE 
            user_id = ? AND decks.status = 'active'
        GROUP BY 
            decks.deck_id;
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