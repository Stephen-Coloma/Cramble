import { Request, Response, NextFunction } from "express";
import { databaseInstance as Database }  from "../database/mysql";
import sendErrorToClient from "../utilities/errorHandler";

/** isEmailExists middleware checks whether an inputed email is already existing in the database or not.
 * 
 * responds "{message: email already taken}" when email already exist
 * proceed to signUpController when valid
 */
const isEmailExists = async (req: Request, res: Response, next: NextFunction) =>{
    const email = req.body.email as string;

    const queryString = `SELECT COUNT(email) AS count FROM users WHERE email = ?`;
    const values = [email];

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);
        const count = results[0].count;
        count > 0 ? res.status(406).send({messsage: 'Email already taken'}) : next();
    }catch(error: unknown){
        sendErrorToClient(error, res);
    }
}

export default isEmailExists;