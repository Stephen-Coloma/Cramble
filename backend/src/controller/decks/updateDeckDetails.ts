import { Request, Response } from "express";

const updateDeckDetailsController = (req: Request, res: Response) =>{
    res.send('updated deck details')
}

export default updateDeckDetailsController;