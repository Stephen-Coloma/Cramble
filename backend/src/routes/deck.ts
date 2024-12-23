import { Router } from "express";
import getDecksController from "../controller/deck/getDecks";
import createDeckController from "../controller/deck/createDeck";
import updateDeckDetailsController from "../controller/deck/updateDeckDetails";
import deleteDeckController from "../controller/deck/deleteDeck";
import isDeckDataValid from "../middleware/validation/isDeckDataValid";
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";

const deckRouter = Router();

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Retrieve a list of active decks for the authenticated user.
 *     description: This endpoint fetches all active decks for the user identified by the JWT token.
 *     tags:
 *       - decks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of active decks for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deckId:
 *                     type: integer
 *                     description: The unique identifier of the deck.
 *                   title:
 *                     type: string
 *                     description: The title of the deck.
 *                   description:
 *                     type: string
 *                     description: A description of the deck.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the deck was created.
 *             examples:
 *               success:
 *                 value: 
 *                   [
 *                     {
 *                       "deckId": 1,
 *                       "title": "Math Deck",
 *                       "description": "A deck of math-related flashcards.",
 *                       "createdAt": "2024-12-23T10:00:00Z"
 *                     },
 *                     {
 *                       "deckId": 2,
 *                       "title": "History Deck",
 *                       "description": "A deck of history-related flashcards.",
 *                       "createdAt": "2024-12-22T14:00:00Z"
 *                     }
 *                   ]
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *     middleware:
 *       - verifyToken:
 *           description: Validates the user's JWT token and attaches the user ID to the request.
 */
deckRouter.get('/decks', getDecksController);

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Create a new deck for the authenticated user.
 *     description: This endpoint allows the user to create a new deck by providing a title, description, and created date.
 *     tags:
 *       - decks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the deck.
 *                 example: "Math Deck"
 *               description:
 *                 type: string
 *                 description: A brief description of the deck.
 *                 example: "A deck of math-related flashcards."
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the deck was created.
 *                 example: "2024-12-23T10:00:00Z"
 *     responses:
 *       201:
 *         description: Deck successfully created.
 *       400:
 *         description: Invalid input data, validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invalidFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["title", "description"]
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
deckRouter.post('/decks', isDeckDataValid, createDeckController); 

/**
 * @swagger
 * /api/decks/{deckId}:
 *   put:
 *     summary: Update the details of an existing deck.
 *     description: This endpoint allows the authenticated user to update the details of a deck they own, including the title, description, and the last edited date.
 *     tags:
 *       - decks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck to be updated.
 *         schema:
 *           type: string
 *           example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the deck.
 *                 example: "Updated Math Deck"
 *               description:
 *                 type: string
 *                 description: The updated description of the deck.
 *                 example: "A deck of updated math flashcards."
 *               editedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the deck was last edited.
 *                 example: "2024-12-23T11:00:00Z"
 *     responses:
 *       200:
 *         description: Deck successfully updated.
 *       400:
 *         description: Invalid input data, validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invalidFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["title", "description"]
 *       401:
 *         description: Unauthorized, user is not the owner of the deck or token is missing/invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

deckRouter.put('/decks/:deckId', isOwnerOfDeck, isDeckDataValid, updateDeckDetailsController);

/**
 * @swagger
 * /api/decks/{deckId}:
 *   delete:
 *     summary: Delete a deck (soft delete).
 *     description: This endpoint allows the authenticated user to delete (soft delete) a deck they own. The deck's `status` will be updated to `deleted`, rather than removing it from the database entirely.
 *     tags:
 *       - decks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck to be deleted.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Deck successfully deleted (soft delete).
 *       400:
 *         description: Invalid deck ID or deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete the deck."
 *       401:
 *         description: Unauthorized, user is not the owner of the deck or token is missing/invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

deckRouter.delete('/decks/:deckId', isOwnerOfDeck, deleteDeckController);

export default deckRouter;