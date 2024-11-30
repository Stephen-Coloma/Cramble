import { Request, Response } from "express";

const deleteDeckController = (req: Request, res: Response) =>{
    res.send('deleted a deck')
}

export default deleteDeckController;