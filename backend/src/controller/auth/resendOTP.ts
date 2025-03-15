import { Request, Response } from "express";
import sendErrorToClient  from "../../utilities/errorHandler";
import crypto from 'crypto'
import { ResendConfirmationCodeCommand, ResendConfirmationCodeCommandInput } from "@aws-sdk/client-cognito-identity-provider"
import {cognito, CLIENT_ID, CLIENT_SECRET} from '../../services/cognitoService'

const resendOTPController = async(req: Request, res: Response) => {
    const username = req.body.username as string;
    try{
        // cognito confirmation
        await cognitoResendConfirmationCode(username);
        res.status(200).json({message: "New code sent"}).end()
    }catch(error: unknown){
        console.log(error);
        sendErrorToClient(error, res)
    }
}

/**
 * Method called to confirm the user in aws cognito
*/
async function cognitoResendConfirmationCode(username:string) {
    const secretHashGenerated = generateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
    
    const input: ResendConfirmationCodeCommandInput = {
        ClientId: CLIENT_ID,
        SecretHash: secretHashGenerated,
        Username: username,
    };
    
    try{
        const command = new ResendConfirmationCodeCommand(input);
        const response = await cognito.send(command);
        console.log(response);
        return
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

export default resendOTPController;