import { Router } from "express";
// import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import getFlashcardsController from "../controller/flashcard/getFlashcards"
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import addFlashcardToDeckController from "../controller/flashcard/addFlashcardToDeck";
import isFlashCardDataValid from "../middleware/validation/isFlashCardDataValid";

const flashcardRouter = Router();

flashcardRouter.get('/decks/:deckId/flashcards', isOwnerOfDeck, getFlashcardsController);
flashcardRouter.post('/decks/:deckId/flashcards', isOwnerOfDeck, isFlashCardDataValid, addFlashcardToDeckController);
// flashcardRouter.put('/flashcards/:flashcardId', updateFlashcardController);
// flashcardRouter.delete('/decks/flashcards', deleteFlashcardsController);
// flashcardRouter.get('/decks/:deckId/attempt', getFlashcardsController);

export default flashcardRouter;
``