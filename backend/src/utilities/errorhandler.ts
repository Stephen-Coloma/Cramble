import { Response } from "express";

/**
 * This utility function is used to return error messages to client requests.
 * It will also handle production and development environment.
 * @param error - the error to be send: Error | string | unknown
 * @param res - response object used to send data to client
 * @param statusCode - specified status code to be sent. default to 500
 */
export default function sendErrorToClient(error: unknown, res: Response, statusCode: number = 500){
    //do not send errors to clients when in production
    if(process.env.NODE_ENV === 'production'){
        res.send("🚀");
        return;
    }

    if(('message' in (error as Error) && (error as Error).message !== "")){
        const errorToSend = new Error(getErrorMessage(error));
    
        return res.status(statusCode).json({
            name: errorToSend.name,
            message: errorToSend.message,
            // stack: errorToSend.stack
        }).end();
    }else{
        return res.status(statusCode).json(error).end();
    }
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
