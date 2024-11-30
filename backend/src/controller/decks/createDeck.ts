import { Request, Response } from "express";

const createDeckController = (req: Request, res: Response) =>{
    //get user id from the jwt token stored in req.userID
    // const userId = req.userId;


    res.send('created a deck')
}

export default createDeckController;