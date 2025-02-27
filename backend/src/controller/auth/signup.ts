import { Request, Response,  } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import { UserSignUp } from "../../dtos/user/UserSignUp.dto";
import sendErrorToClient from "../../utilities/errorHandler";
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import { CognitoIdentityProviderClient, SignUpCommand, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider"

const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION    
})

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
        await cognito_signup(user.username, user.email, user.firstName, user.lastName, user.password);
    
        // save a copy to app databse
        user.password = hashPassword(user.password);
        await saveToDatabase(user, res);
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }

}

/**
 * Method called to create a user in aws cognit o
 * @param username 
 * @param email 
 * @param firstName 
 * @param lastName 
 * @param password 
 */
async function cognito_signup(username:string, email: string, firstName: string, lastName: string, password: string) {

    const clientId = process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID as string | 'noID';
    const clientSecret = process.env.AWS_COGNITO_CRAMBLE_CLIENT_SECRET as string | 'noSecret';

    const secretHashGenerated = generateSecretHash(username, clientId, clientSecret);

    const input: SignUpCommandInput = {
        ClientId: clientId,
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
        const response = await cognito.send(command);
        console.log(response);
    }catch(error: unknown){
        console.log(error);
        
        throw(error)
    }
}

/**
 * a function that saves user signup data to the database
 *  */ 
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