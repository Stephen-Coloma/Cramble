import { Response } from "express";

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
    
    //must not undefined and message must not have empty message
    if((error as Error).message && (error as Error).message !== ""){       
        const errorToSend = new Error(getErrorMessage(error)); // makes passed in errors as type Error. since we can throw string and numbers 
        res.status(statusCode).json({
            name: errorToSend.name,
            message: errorToSend.message,
            //error //debugging on client api
            // stack: errorToSend.stack
        }).end()
    }else{      
        res.status(statusCode).json(error).end();
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
