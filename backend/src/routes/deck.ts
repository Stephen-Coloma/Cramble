import { Router } from "express";
import getDecksController from "../controller/deck/getDecks";
import createDeckController from "../controller/deck/createDeck";
import updateDeckDetailsController from "../controller/deck/updateDeckDetails";
import deleteDeckController from "../controller/deck/deleteDeck";
import isDeckDataValid from "../middleware/validation/isDeckDataValid";
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";

const deckRouter = Router();

deckRouter.get('/decks', getDecksController);
deckRouter.post('/decks', isDeckDataValid, createDeckController); 
deckRouter.put('/decks/:deckId', isOwnerOfDeck, isDeckDataValid, updateDeckDetailsController);
deckRouter.delete('/decks/:deckId', isOwnerOfDeck, deleteDeckController);

export default deckRouter;