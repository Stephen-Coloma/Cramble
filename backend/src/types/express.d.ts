import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string; //adds an additional field of userId in the Request interface of express
        }
    }
}