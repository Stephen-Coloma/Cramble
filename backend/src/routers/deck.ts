import { Router } from "express";
import getAllDecksController from "../controller/decks/getAllDecks";
import createDeckController from "../controller/decks/createDeck";
import updateDeckDetailsController from "../controller/decks/updateDeckDetails";
import deleteDeckController from "../controller/decks/deleteDeck";
import isCreatingDeckDataValid from "../middleware/validation/isCreatingDeckDataValid";

const deckRouter = Router();

deckRouter.get('/decks', getAllDecksController);
/**
 * Request Body must have data:
 * { 
     "title": "";
     "description": "";
     "createdAt": "";
    }   
 */
deckRouter.post('/decks', isCreatingDeckDataValid, createDeckController); //create a middleware that validates the content of the request when creating a deck
deckRouter.put('/decks/:deck_id', updateDeckDetailsController);
deckRouter.delete('/decks/:deck_id', deleteDeckController);

export default deckRouter;