import { Response } from "express";

export function sendErrorToClient(error: unknown, res: Response){
    // console.log(error); // debugging on server console
    
    if((error as Error).message !== ""){
        const errorToSend = new Error(getErrorMessage(error)); // makes passed in errors as type Error. since we can throw string and numbers 
        res.status(500).json({
            name: errorToSend.name,
            message: errorToSend.message,
            //error //debugging on client api
            // stack: errorToSend.stack
        }).end()
    }else{      
        res.status(500).json(error).end();
    }
}

// a function that gets the error message from an error
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

