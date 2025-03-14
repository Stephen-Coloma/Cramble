import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTTokenContent } from "../dtos/JWTTokenContent";
import { CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { resetCookies } from "../utilities/resetCookies";

const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "no user pool id",
    tokenUse: "access",
    clientId: process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID || "no client id",
});

const CLIENT_ID = process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID || 'noId';

/* a middleware that manages and verifies access token on each request */
const verifyCognitoToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.token;
    const accessToken = req.signedCookies.accessToken;
    const refreshToken = req.signedCookies.refreshToken;    

    if (!token || !accessToken || !refreshToken) { 
        resetCookies(res);
        res.status(401).send({ message: 'Access Denied - Invalid or Expired Tokens' });
        return;
    } else { // all tokens are present
        try{
            req.userId = await decodeUserId(token);
            
            const accessTokenPayload = verifier.verifySync(accessToken); 

            if(accessTokenPayload){ //access token is valid
                req.userId = await decodeUserId(token);
                next();
            }else{
                //refresh the acess token
                const newTokens = await refreshAccessToken(refreshToken);

                if(newTokens){
                    res.cookie("accessToken", newTokens.AccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: newTokens.ExpiresIn! * 1000,
                    });

                    res.cookie("refreshToken", newTokens.RefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                    });

                    next()
                }else{
                    throw new Error('Refreshing Token Not Successful')
                }
            }
        }catch(error: unknown){
            console.error("Error: ", error);
            resetCookies(res);
            res.status(401).send({ message: 'Access Denied - Invalid or Expired Tokens' });
            return;
        }
    }
};

/**Function to call when access token is invalid, and tries to refresh a token */
async function refreshAccessToken(refreshToken: string) {
    const input: InitiateAuthCommandInput = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        },
        ClientId: CLIENT_ID,
    };

    try {
        const command = new InitiateAuthCommand(input);
        const response = await cognito.send(command);

        return (response.AuthenticationResult) ? response.AuthenticationResult : null;
    } catch (error) {
        console.error("Cognito refresh error:", error);
        return null;
    }
}

/**Function that decodes userid from token */
async function  decodeUserId(token: any): Promise<string> {
    const key = process.env.JWT_SECRET_KEY || "";
    const decoded = jwt.verify(token, key, { complete: true });
    return (decoded.payload as JWTTokenContent).userId;
}

export default verifyCognitoToken;