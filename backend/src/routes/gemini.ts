import { Router } from "express";
import generateFlashcardController from "../controller/gemini/generateFlashcard";

const geminiRouter = Router();

geminiRouter.post('/gemini/flashcards/generate', generateFlashcardController)

export default geminiRouter;