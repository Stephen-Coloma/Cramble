import { Request, Response } from "express";

const getAllQuizzes = (req: Request, res: Response) =>{
    res.send('sent all quizzes')
}

export default getAllQuizzes;