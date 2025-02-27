import { Request, Response } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient  from "../../utilities/errorHandler";
import crypto from 'crypto'
import { CognitoIdentityProviderClient, ConfirmSignUpCommand, ConfirmSignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider"

const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION    
})

const CLIENT_ID = process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID || 'noId'
const CLIENT_SECRET = process.env.AWS_COGNITO_CRAMBLE_CLIENT_SECRET || 'noSecret'


const confirmSignupController = async(req: Request, res: Response) => {
    const username = req.body.username as string;
    const confirmationCode = req.body.confirmationCode as string;

    try{
        // cognito confirmation
        await cognitoConfirmSignup(username, confirmationCode);

        //if the account is confirmed, changed the status of user from unverified to active
        await setUserAsActiveToDatabase(username, res);
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

/**
 * Method called to confirm the user in aws cognito
*/
async function cognitoConfirmSignup(username:string, confirmationCode: string) {
    const secretHashGenerated = generateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
    
    const input: ConfirmSignUpCommandInput = {
        ClientId: CLIENT_ID,
        SecretHash: secretHashGenerated,
        Username: username,
        ConfirmationCode: confirmationCode
    };
    
    try{
        const command = new ConfirmSignUpCommand(input);
        await cognito.send(command);
        return
    }catch(error: unknown){        
        throw(error)
    }
}

/**
 * Method that marks the user as active in the database
 */
async function setUserAsActiveToDatabase(username: string, res: Response){
    const queryString = `
            UPDATE users 
            SET status = 'active'
            WHERE username = ?
        `;

    try{
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, [username]);
        if(results.affectedRows > 0){
            res.status(200).json({message: "Account Verified"}).end()
        }
    }catch(error: unknown){
        throw(error)
    }
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

export default confirmSignupController;