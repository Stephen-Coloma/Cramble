import { Request, Response } from "express";
import { UserLogin } from "../../dtos/UserLogin.dto";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient  from "../../utilities/errorhandler";
import bcrypt from 'bcryptjs';

const loginController = async(req: Request<{}, {}, UserLogin>, res: Response) => {
    const { username, password } = req.body;

    const queryString = `
        SELECT password
        FROM users
        WHERE username = ?;
    `;

    const values = [username, password]; // username and password from the user input
        
    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);   
        
        //results array is empty, usually results are in array
        if(results.length === 0){
            res.status(401).json({message: "Username not found"}).end()
        }else{
            let hashedPassword = results[0].password;

            if(bcrypt.compareSync(password, hashedPassword)){
                //possible to sync cookies or sessions before redirecting to homapage
                res.status(202).json({message: "Login successful"}).end()
            }else{
                res.status(401).json({message: "Incorrect password"}).end()
            }
        }
                
    }catch(error: unknown){
        sendErrorToClient(error, res);
    }
}

export default loginController;