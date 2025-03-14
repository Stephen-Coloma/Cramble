import { Request, Response } from "express";
import { UserLogin } from "../../dtos/user/UserLogin.dto";
import sendErrorToClient  from "../../utilities/errorHandler";
import crypto from 'crypto';
import { InitiateAuthCommand, InitiateAuthCommandInput, InitiateAuthCommandOutput, NotAuthorizedException, UserNotConfirmedException } from "@aws-sdk/client-cognito-identity-provider";
import jwt from 'jsonwebtoken';
import { databaseInstance as Database } from "../../database/mysql";
import {cognito, CLIENT_ID, CLIENT_SECRET} from '../../services/cognitoService'

const loginController = async (req: Request<{}, {}, UserLogin>, res: Response) => {
    try {
        const { username, password } = req.body;

        // login to aws, throws an error for incorrect credentials. 
        const cognitoResponse = await cognitoLogin(username, password);

        if (cognitoResponse.AuthenticationResult) {
            const { AccessToken, RefreshToken, ExpiresIn } = cognitoResponse.AuthenticationResult;
    
            // get the userId from database
            const userId = await getUserIdFromDatabase(username);
    
            const payload = { userId: userId };
            const key = process.env.JWT_SECRET_KEY || "";
            const token = jwt.sign(payload, key, { algorithm: 'HS256' });
    
            loginSuccessful(res, AccessToken!, RefreshToken!, ExpiresIn!, token);
        }
    } catch (error: unknown) {
        if(error instanceof NotAuthorizedException){
            res.status(401).json({message: error.message});
        }else if(error instanceof UserNotConfirmedException){
            res.status(412).json({message: error.message});
        }else{
            sendErrorToClient(error, res);
        }
    }
};


/**Method that logs in the user into the aws cognito */
async function cognitoLogin(username: string, password: string): Promise<InitiateAuthCommandOutput> {
    const secretHashGenerated = generateSecretHash(username, CLIENT_ID, CLIENT_SECRET);

    const input: InitiateAuthCommandInput = {
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            "PASSWORD": password,
            "USERNAME": username,
            "SECRET_HASH": secretHashGenerated
        },
        ClientId: CLIENT_ID,
    };

    try {
        const command = new InitiateAuthCommand(input);
        const response = await cognito.send(command);
        return response;
    } catch (error: unknown) {
        throw (error);
    }
}

/**A function that gets the user id in the database */
async function getUserIdFromDatabase(username: string): Promise<number | null> {
    const queryString = `
        SELECT user_id
        FROM users
        WHERE username = ? and status = 'active';
    `;

    const values = [username];

    try {
        const connection = await Database.connect();
        const results = await Database.processQuery(connection, queryString, values);

        if (results.length > 0) {
            return results[0].user_id;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user ID from database:", error);
        return null;
    }
}

/**Helper function that generatess hash of username, aws clientId and aws clientSecret.
 * This is a required params when requesting to aws.
 */
function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
    return crypto.createHmac("sha256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}

/**Function that is called when the user has correct credentials.
 * It sets up cookie based sessions.
 */
function loginSuccessful(res: Response, AccessToken: string, RefreshToken: string, ExpiresIn: number, token: string){   
    res.cookie("accessToken", AccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ExpiresIn! * 1000, // Set maxAge to token's expiration in milliseconds
        signed: true
    });

    res.cookie("refreshToken", RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });

    res.status(200).json({
        message: "Login successful",
    }).end();
}

export default loginController;