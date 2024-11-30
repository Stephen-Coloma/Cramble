import { Router } from "express";
import getAllDecksController from "../controller/decks/getAllDecks";
import createDeckController from "../controller/decks/createDeck";
import updateDeckDetailsController from "../controller/decks/updateDeckDetails";
import deleteDeckController from "../controller/decks/deleteDeck";

const decksRouter = Router();

decksRouter.get('/decks', getAllDecksController)
decksRouter.post('/decks', createDeckController)
decksRouter.put('/decks/:deck_id', updateDeckDetailsController)
decksRouter.delete('/decks/:deck_id', deleteDeckController)



export default decksRouter