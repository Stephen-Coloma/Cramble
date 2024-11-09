import { Request, Response, NextFunction } from "express";
import Database from "../database/mysql";

/** isUsernameExists middleware checks whether an inputed username is already existing in the database or not.
 * 
 * responds "invalid" when username already exist
 * proceed to signUpController when valid
 */
const isUsernameExists = (req: Request, res: Response, next: NextFunction) =>{
    const username = req.body.username;

    const queryString = `SELECT COUNT(*) AS count FROM users WHERE username = '${username}'`;

    Database.Connect()
    .then((connection) => {

        Database.ProcessQuery(connection, queryString)
        .then(results => {
            const count = results[0].count;
            if(count > 0){
                res.json('invalid')
            }else{
                next()
            }
        })
        .catch(error => {
            return res.status(500).json({
                message: error.message,
                error
            })
        })


    })
    .catch(error => {
        return res.status(500).json({
            message: error.message,
            error
        })
    })
}

export default isUsernameExists;