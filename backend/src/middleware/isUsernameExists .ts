import { Request, Response, NextFunction } from "express";
import {databaseInstance as Database}  from "../database/mysql";

/** isUsernameExists middleware checks whether an inputed username is already existing in the database or not.
 * 
 * responds "invalid" when username already exist
 * proceed to signUpController when valid
 */
const isUsernameExists = async (req: Request, res: Response, next: NextFunction) =>{
    const username = req.body.username;

    const queryString = `SELECT COUNT(username) AS count FROM users WHERE username = '${username}'`;

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString);
        const count = results[0].count
        count > 0 ? res.json('invalid') : next()
    }catch(error: unknown){
        if(error instanceof Error){
            res.json({
                message: error.message,
                error
            })
        }
    }
}

export default isUsernameExists;