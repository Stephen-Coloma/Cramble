import { Router } from "express";
import getAllDecksController from "../controller/deck/getAllDecks";
import createDeckController from "../controller/deck/createDeck";
import updateDeckDetailsController from "../controller/deck/updateDeckDetails";
import deleteDeckController from "../controller/deck/deleteDeck";
import isDeckDataValid from "../middleware/validation/isDeckDataValid";
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";

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
deckRouter.post('/decks', isDeckDataValid, createDeckController); //create a middleware that validates the content of the request when creating a deck

/**
 * Request Body must have data:
 * { 
     "title": "";
     "description": "";
     "editedAt": "";
    }   
 */
deckRouter.put('/decks/:deckId', isOwnerOfDeck, isDeckDataValid, updateDeckDetailsController);
deckRouter.delete('/decks/:deckId', isOwnerOfDeck, deleteDeckController);

export default deckRouter;