import { Router } from "express";
// import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import getFlashcardsController from "../controller/flashcard/getFlashcardsController";
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";

const flashcardRouter = Router();

flashcardRouter.get('/decks/:deckId/flashcards', isOwnerOfDeck, getFlashcardsController);
// flashcardRouter.post('/decks/:deckId/flashcards', addFlashcardToDeckController);
// flashcardRouter.put('/flashcards/:flashcardId', updateFlashcardController);
// flashcardRouter.delete('/decks/flashcards', deleteFlashcardsController);
// flashcardRouter.get('/decks/:deckId/attempt', getFlashcardsController);

export default flashcardRouter;
