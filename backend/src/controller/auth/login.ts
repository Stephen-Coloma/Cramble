import { Request, Response } from "express";
import { UserLogin } from "../../dtos/user/UserLogin.dto";
import sendErrorToClient from "../../utilities/errorHandler";
import crypto from 'crypto';
import { CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput, InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import jwt from 'jsonwebtoken';
import { databaseInstance as Database } from "../../database/mysql";

const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
});

const CLIENT_ID = process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID || 'noId';
const CLIENT_SECRET = process.env.AWS_COGNITO_CRAMBLE_CLIENT_SECRET || 'noSecret';

const loginController = async (req: Request<{}, {}, UserLogin>, res: Response) => {
    try {
        const { username, password } = req.body;

        // login to aws
        const cognitoResponse = await cognitoLogin(username, password);

        if (!cognitoResponse.AuthenticationResult) {
            res.status(401).send({ message: "Incorrect password or Username not found" });
            return;
        }

        const { AccessToken, RefreshToken, ExpiresIn } = cognitoResponse.AuthenticationResult;

        // get the userId from database
        const userId = await getUserIdFromDatabase(username);

        const payload = { userId: userId };
        const key = process.env.JWT_SECRET_KEY || "";
        const token = jwt.sign(payload, key, { algorithm: 'HS256' });

        // Convert expiresIn to milliseconds for cookie maxAge
        const expiresInMilliseconds = ExpiresIn! * 1000;

        res.cookie("accessToken", AccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresInMilliseconds, // Set maxAge to token's expiration
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

    } catch (error: unknown) {
        sendErrorToClient(error, res);
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

function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
    return crypto.createHmac("sha256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}

export default loginController;