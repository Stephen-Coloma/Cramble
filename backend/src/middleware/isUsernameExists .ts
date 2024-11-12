import { Request, Response, NextFunction } from "express";
import { databaseInstance as Database }  from "../database/mysql";
import { sendErrorToClient } from "../utilities/utility";

/** isUsernameExists middleware checks whether an inputed username is already existing in the database or not.
 * 
 * responds "{message: username username is taken already}" when username already exist
 * proceed to signUpController when valid
 */
const isUsernameExists = async (req: Request, res: Response, next: NextFunction) =>{
    const username = req.body.username as string;

    const queryString = `SELECT COUNT(username) AS count FROM users WHERE username = ?`;
    const values = [username];

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);
        const count = results[0].count;
        count > 0 ? res.status(406).json({message: "username is already taken"}).end() : next();
    }catch(error: unknown){
        sendErrorToClient(error, res);
    }
}

export default isUsernameExists;