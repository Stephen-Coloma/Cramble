import { Request, Response } from "express";

const createDeckController = (req: Request, res: Response) =>{
    res.send('created a deck')
}

export default createDeckController;