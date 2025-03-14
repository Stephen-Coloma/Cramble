import { Router } from "express";
import getDecksController from "../controller/deck/getDecks";
import createDeckController from "../controller/deck/createDeck";
import updateDeckDetailsController from "../controller/deck/updateDeckDetails";
import deleteDeckController from "../controller/deck/deleteDeck";
import isDeckDataValid from "../middleware/validation/isDeckDataValid";
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import isDeckFlashcardsDataValid from "../middleware/validation/isDeckFlashcardsDataValid";

const deckRouter = Router();

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Retrieve all active decks for the authenticated user.
 *     description: This endpoint allows the authenticated user to fetch their active decks along with total flashcards and mastery breakdown.
 *     tags:
 *       - decks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's decks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deckId:
 *                     type: integer
 *                     description: The unique ID of the deck.
 *                     example: 123
 *                   title:
 *                     type: string
 *                     description: The title of the deck.
 *                     example: "Science Flashcards"
 *                   description:
 *                     type: string
 *                     description: The description of the deck.
 *                     example: "A deck covering basic science concepts."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the deck was created.
 *                     example: "2024-01-01T10:00:00Z"
 *                   editedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the deck was last edited.
 *                     example: "2024-01-02T15:30:00Z"
 *                   totalCards:
 *                     type: integer
 *                     description: The total number of flashcards in the deck.
 *                     example: 50
 *                   unsureTotal:
 *                     type: integer
 *                     description: Number of flashcards marked as 'unsure'.
 *                     example: 10
 *                   familiarTotal:
 *                     type: integer
 *                     description: Number of flashcards marked as 'familiar'.
 *                     example: 20
 *                   masteredTotal:
 *                     type: integer
 *                     description: Number of flashcards marked as 'mastered'.
 *                     example: 15
 *                   unratedTotal:
 *                     type: integer
 *                     description: Number of flashcards that are not rated.
 *                     example: 5
 *       401:
 *         description: Unauthorized, user token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied - Invalid or Expired Tokens"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
deckRouter.get('/decks', getDecksController);

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Create a new deck with flashcards.
 *     description: This endpoint allows authenticated users to create a new deck and add flashcards to it.
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
 *                 example: "Math Basics"
 *               description:
 *                 type: string
 *                 description: A short description of the deck.
 *                 example: "A deck of basic math flashcards."
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp when the deck was created.
 *                 example: "2024-12-23T10:00:00Z"
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     front:
 *                       type: string
 *                       description: The front side of the flashcard.
 *                       example: "2 + 2"
 *                     back:
 *                       type: string
 *                       description: The back side of the flashcard.
 *                       example: "4"
 *     responses:
 *       200:
 *         description: Deck successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deckId:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Invalid input data, validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error saving generated flashcards"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied - Invalid or Expired Tokens"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
deckRouter.post('/decks', isDeckFlashcardsDataValid, createDeckController); 

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
 *                   example: "Access Denied - Invalid or Expired Tokens"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
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
 *                   example: "Access Denied - Invalid or Expired Tokens"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

deckRouter.delete('/decks/:deckId', isOwnerOfDeck, deleteDeckController);

export default deckRouter;