import { Router } from "express";
import getAllDecksController from "../controller/decks/getAllDecks";
import createDeckController from "../controller/decks/createDeck";
import updateDeckDetailsController from "../controller/decks/updateDeckDetails";
import deleteDeckController from "../controller/decks/deleteDeck";

const deckRouter = Router();

deckRouter.get('/decks', getAllDecksController)
deckRouter.post('/decks', createDeckController)
deckRouter.put('/decks/:deck_id', updateDeckDetailsController)
deckRouter.delete('/decks/:deck_id', deleteDeckController)

export default deckRouter;