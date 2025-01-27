import { Request, Response } from "express";
import { UserLogin } from "../../dtos/user/UserLogin.dto";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient  from "../../utilities/errorHandler";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const loginController = async(req: Request<{}, {}, UserLogin>, res: Response) => {
    const { username, password } = req.body;

    const queryString = `
        SELECT password, user_id
        FROM users
        WHERE username = ? and status = 'active';
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
                let user_id = results[0].user_id;
                //adding the JWT token
                const payload = {userId: user_id} ;
                const key = process.env.JWT_SECRET_KEY || "";
                const token = jwt.sign(payload, key, {algorithm: 'HS256'}); //default encoding

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', //false if in development
                    signed: true,
                })
                .status(200).json({message: "Login successful"}).end()
            }else{
                res.status(401).json({message: "Incorrect password"}).end()
            }
        }
                
    }catch(error: unknown){
        sendErrorToClient(error, res);
    }
}

export default loginController;