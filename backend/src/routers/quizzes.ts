import { Router } from "express";
import getAllQuizzes from "../controller/quizzes/getAllQuizzes";

const quizzesRouter = Router();

quizzesRouter.get('/quizzes', getAllQuizzes)

export default quizzesRouter