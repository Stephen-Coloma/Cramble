import { NextFunction, Request, Response } from "express"
import  jwt from "jsonwebtoken";
import sendErrorToClient from "../utilities/errorhandler";
import { JWTTokenContent } from "../dtos/JWTTokenContent";

const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.signedCookies.token;
    
    if(!token){
        res.status(401).json({message: "Access denied"}).end();
    }else{
        try{
            const key = process.env.JWT_SECRET_KEY || "";
            const decoded = jwt.verify(token, key, {complete: true});
            req.userId = (decoded.payload as JWTTokenContent).userId;
            next()
        }catch(error: unknown){
            sendErrorToClient(error, res)
        }
    }

} 

export default verifyToken;