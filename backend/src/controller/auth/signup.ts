import { Request, Response,  } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import { UserSignUp } from "../../dtos/user/UserSignUp.dto";
import sendErrorToClient from "../../utilities/errorHandler";
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import { SignUpCommand, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider"
import { cognito, CLIENT_ID, CLIENT_SECRET } from '../../services/cognitoService'


const signUpController = async(req: Request<{}, {}, UserSignUp>, res: Response) => {
    const user: UserSignUp = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }

    try{
        // cognito sign up
        await cognitoSignup(user.username, user.email, user.firstName, user.lastName, user.password);
    
        // save a copy to app databse
        user.password = hashPassword(user.password);
        await saveUserToDatabase(user, res);
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }

}

/**
 * Method called to create a user in aws cognito
 * @param username 
 * @param email 
 * @param firstName 
 * @param lastName 
 * @param password 
 */
async function cognitoSignup(username:string, email: string, firstName: string, lastName: string, password: string) {
    const secretHashGenerated = generateSecretHash(username, CLIENT_ID, CLIENT_SECRET);

    const input: SignUpCommandInput = {
        ClientId: CLIENT_ID,
        SecretHash: secretHashGenerated,
        Username: username,
        Password: password,
        UserAttributes: [ // AttributeListType
            { // AttributeType
                Name: 'email',
                Value: email
            },
            { 
                Name: 'family_name',
                Value: lastName
            },
            { 
                Name: 'given_name',
                Value: firstName
            },
            { 
                Name: 'name',
                Value: firstName + " " + lastName
            },
        ],
    };

    try{
        const command = new SignUpCommand(input);
        await cognito.send(command);
        return;
    }catch(error: unknown){
        throw(error)
    }
}

/**
 * a function that saves user signup data to the database
 * assigns unverified status to user because they need to confirm first their identity through email for aws cognito
 *  */ 
async function saveUserToDatabase(user:UserSignUp, res: Response) {
    const queryString = `
            INSERT INTO users (first_name, last_name, username, password, email, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const values = [
        user.firstName,
        user.lastName,
        user.username,
        user.password,
        user.email,
        'unverified'
    ];

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);
        if(results.affectedRows > 0){
            res.status(201).json({message: "User created successfully. Please verify account"}).end()
        }
    }catch(error: unknown){
        throw(error)
    }
}

/**
 * a function that hashes a password string before saving to the database
 *  */ 
function hashPassword(password: string): string {
    const hash =  bcrypt.hashSync(password, 5);
    return hash;
}

/***
 * function that generates secret hash needed for siging up to aws cognito sign up
 * this is from the official aws documentation
 * */
function generateSecretHash(username: string, clientId: string, clientSecret:string) : string {
    return crypto.createHmac("sha256", clientSecret)
        .update(username + clientId)
        .digest("base64")
}

export default signUpController;