import { NextFunction, Request, Response } from "express"
import  jwt, {Jwt} from "jsonwebtoken";
import sendErrorToClient from "../utilities/errorhandler";

//adds new field to the Jwt interface because it does not have userId and we cannot reference it
interface JWTToken extends Jwt {
    userId: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.signedCookies.token;
    
    if(!token){
        res.status(401).json({message: "Access denied"}).end();
    }else{
        try{
            const key = process.env.JWT_SECRET_KEY || "";
            const decoded = jwt.verify(token, key, {complete: true}) as JWTToken;
            req.userId = decoded.userId;
            next()
        }catch(error: unknown){
            sendErrorToClient(error, res)
        }
    }

} 

export default verifyToken;