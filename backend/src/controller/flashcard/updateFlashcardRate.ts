import {Request, Response } from 'express';
import { Flashcard } from '../../dtos/flashcard/Flashcard.dto';
import { Deck } from '../../dtos/deck/Deck.dto';
import sendErrorToClient from '../../utilities/errorHandler';
import { databaseInstance as Database } from '../../database/mysql';

type FlashcardsRateUpdateData = Pick<Flashcard, 'flashcardId' | 'mastery'>;

const updateFlashcardRateController = async (req: Request<{}, {}, FlashcardsRateUpdateData[]>, res: Response) => {
    const deckId = (req.params as Deck).deckId;
    const ratings: FlashcardsRateUpdateData[] = req.body;

    const queryString = `
        UPDATE flashcards 
        SET mastery = ?
        WHERE flashcard_id = ? AND deck_id = ?;
    `

    // rate each flashcard. each card has [mastery, flashcardId, deckId] to be used in the for loop update
    const queryValues = ratings.map(rating => (
        [rating.mastery, rating.flashcardId, deckId])
    )

    try{
        const connection = await Database.connect();
        for(const value of queryValues){
            await Database.processQuery(connection, queryString, value);
        }

        res.status(200).json({message: 'Flashcards\' rates updated successfully'}).end();
    }catch(error: unknown){
        sendErrorToClient(error, res);
    }    
}

export default updateFlashcardRateController;