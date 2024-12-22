import { Request, Response,  } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import { UserSignUp } from "../../dtos/UserSignUp.dto";
import sendErrorToClient from "../../utilities/errorhandler";
import bcrypt from 'bcryptjs';


const signUpController = (req: Request<{}, {}, UserSignUp>, res: Response) => {
    const user: UserSignUp = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }

    // all fields are filled based on isSignUpDataValid middleware
    user.password = hashPassword(user.password);
    saveToDatabase(user, res);
}

// a function that saves user signup data to the database
async function saveToDatabase(user:UserSignUp, res: Response) {
    const queryString = `
            INSERT INTO users (first_name, last_name, username, password, email)
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
        user.firstName,
        user.lastName,
        user.username,
        user.password,
        user.email
    ];

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);
        if(results.affectedRows > 0){
            res.status(201).json({message: "User created successfully"}).end()
        }

    }catch(error: unknown){
       sendErrorToClient(error, res);
    }
}

// a function that hashes a password string before saving to the database
function hashPassword(password: string): string {
    const hash =  bcrypt.hashSync(password, 5);
    return hash;
}

export default signUpController;