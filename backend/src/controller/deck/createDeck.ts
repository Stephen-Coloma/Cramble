import {Request, Response} from 'express'
import { databaseInstance as Database } from '../../database/mysql';
import sendErrorToClient from '../../utilities/errorHandler';
import { PoolConnection } from 'mysql2/typings/mysql/lib/PoolConnection';

/**Added mysql transactionn but rollback function does not work */
const createDeckController = async (req: Request, res: Response) =>{   
    const connection = await Database.connect();

    //begin transaction
    try{
        await new Promise<void>((resolve, reject) => {
            connection.beginTransaction((error) =>{
                if(error) {
                    return reject(error)
                };
                resolve();
            })
        })

        // Query 1: Create a deck
        const userId = req.userId; // Ensure req.userId is populated
        const { title, description, createdAt, flashcards } = req.body;

        const deckQuery = `
            INSERT INTO decks(user_id, title, description, created_at, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const deckValues = [userId, title, description, createdAt, 'active'];

        const deckResult: any = await processAsyncQuery(connection, deckQuery, deckValues);
        const deckId = deckResult.insertId;

        // Query 2: Insert flashcards into deck
        for (const flashcard of flashcards) {
            const flashcardQuery = `
                INSERT INTO flashcards(deck_id, front, back)
                VALUES (?, ?, ?)
            `;

            const flashcardValues = [deckId, flashcard.front, flashcard.back];
            await processAsyncQuery(connection, flashcardQuery, flashcardValues);
        }

        // Commit transaction and release the transaction
        await new Promise<void>((resolve, reject) => {
            connection.commit((error: any) => {
            if (error) {
                return reject(error)
            };
            connection.release();
            resolve();
            });
        });

        // Send success response
        res.status(200).json({message: "Deck successfully created"});
    }catch (error) {
        // Rollback transaction on error
        await connection.promise().rollback()
        sendErrorToClient(error, res)
    }
}

async function processAsyncQuery(connection: PoolConnection, queryString: string, values: any[] = []): Promise<any> {
    return new Promise((resolve, reject) =>{
        connection.query(queryString, values, (err, result) => {
            if(err){
                return reject(err);
                ;
            }
            resolve(result);
        });
    });
} 

export default createDeckController;