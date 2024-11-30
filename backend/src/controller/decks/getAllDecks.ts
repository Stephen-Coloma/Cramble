import { Request, Response } from "express";

const getAllDecksController = (req: Request, res: Response) =>{
    res.send('get all decks')
}

export default getAllDecksController;