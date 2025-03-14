import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const CLIENT_ID = process.env.AWS_COGNITO_CRAMBLE_CLIENT_ID || 'noId';
export const CLIENT_SECRET = process.env.AWS_COGNITO_CRAMBLE_CLIENT_SECRET || 'noSecret';

export const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

export const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "no user pool id",
    tokenUse: "access",
    clientId: CLIENT_ID
});