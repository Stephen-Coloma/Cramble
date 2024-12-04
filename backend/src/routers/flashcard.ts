import { Router } from "express";
// import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import getFlashcardsController from "../controller/flashcard/getFlashcards"
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import addFlashcardToDeckController from "../controller/flashcard/addFlashcardToDeck";
import isFlashCardDataValid from "../middleware/validation/isFlashCardDataValid";
import updateFlashcardController from "../controller/flashcard/updateFlashcard";

const flashcardRouter = Router();

flashcardRouter.get('/flashcards/:deckId', isOwnerOfDeck, getFlashcardsController);
flashcardRouter.post('/flashcards/:deckId', isOwnerOfDeck, isFlashCardDataValid, addFlashcardToDeckController);
flashcardRouter.put('/flashcards/:deckId/:flashcardId', isOwnerOfDeck, updateFlashcardController);
// flashcardRouter.delete('/decks/flashcards', deleteFlashcardsController);
// flashcardRouter.get('/decks/:deckId/attempt', getFlashcardsController);

export default flashcardRouter;