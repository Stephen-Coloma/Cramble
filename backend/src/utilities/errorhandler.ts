import { Response } from "express";
import { Err } from "joi";

/**
 * This utility function is used to return error messages to client requests.
 * It will also handle production and development environment.
 * @param error - the error to be send: Error | string | unknown
 * @param res - response object used to send data to client
 * @param statusCode - specified status code to be sent. default to 500
 */
export default function sendErrorToClient(error: unknown, res: Response, statusCode: number = 500){
    if(process.env.NODE_ENV === 'production'){
        res.send("🚀");
        return;
    }
    // console.log(error); // debugging on server console
    
    //defined error
    if (error) {
        // Handle the case where `error` is either a string or an object with a `message` property and has value
        if (typeof error === 'string' 
            || ('message' in (error as Error) && (error as Error).message !== "")) {

            const errorToSend = new Error(getErrorMessage(error));
    
            return res.status(statusCode).json({
                name: errorToSend.name,
                message: errorToSend.message,
                // Optionally, include the stack trace for debugging
                // stack: errorToSend.stack
            }).end();
        }
    
        // If the error doesn't have a message property, just return it as is
        return res.status(statusCode).json(error).end();
    }
    
    // If `error` is undefined or null, respond with the original error
    return res.status(statusCode).json(error).end();
}

// a helper function that gets the error message from an error
function getErrorMessage(error: unknown) : string{
    let message;

    if(error instanceof Error){              
        message = error.message;
    }else if(error && typeof error === 'object' && "message" in error){
        message = String(error.message)
    }else if(typeof error === 'string'){
        message = error
    }else{
        message = 'Unknown error occured'
    }

    return message;
}
