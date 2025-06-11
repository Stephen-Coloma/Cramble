import { Router } from "express";
import getFlashcardsController from "../controller/flashcard/getFlashcards"
import isOwnerOfDeck from "../middleware/isOwnerOfDeck";
import addFlashcardToDeckController from "../controller/flashcard/addFlashcardToDeck";
import isFlashCardDataValid from "../middleware/validation/isFlashCardDataValid";
import updateFlashcardController from "../controller/flashcard/updateFlashcard";
import deleteFlashcardController from "../controller/flashcard/deleteFlashcards";
import updateFlashcardRateController from "../controller/flashcard/updateFlashcardRate";

const flashcardRouter = Router();

/**
 * @swagger
 * /api/flashcards/{deckId}:
 *   get:
 *     summary: Retrieve all flashcards for a specific deck.
 *     description: This endpoint allows the authenticated user to fetch all flashcards belonging to a specific deck. The user must own the deck to access its flashcards.
 *     tags:
 *       - flashcards
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck to retrieve flashcards from.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: A list of flashcards or an empty message if no flashcards are found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   flashcardId:
 *                     type: string
 *                     example: "9999"
 *                   deckId:
 *                     type: string
 *                     example: "12345"
 *                   front:
 *                     type: string
 *                     example: "What is the capital of France?"
 *                   back:
 *                     type: string
 *                     example: "Paris"
 *                   mastery:
 *                     type: number
 *                     example: 5
 *       401:
 *         description: Unauthorized, user does not own the deck or token is invalid/missing.
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

flashcardRouter.get('/flashcards/:deckId', isOwnerOfDeck, getFlashcardsController);

/**
 * @swagger
 * /api/flashcards/{deckId}:
 *   post:
 *     summary: Add a flashcard to a specific deck.
 *     description: This endpoint allows the authenticated user to add a new flashcard to a specific deck they own.
 *     tags:
 *       - flashcards
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck where the flashcard will be added.
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
 *               front:
 *                 type: string
 *                 description: The front content of the flashcard.
 *                 example: "What is the capital of France?"
 *                 minLength: 1
 *                 maxLength: 400
 *               back:
 *                 type: string
 *                 description: The back content of the flashcard.
 *                 example: "Paris"
 *                 minLength: 1
 *                 maxLength: 400
 *     responses:
 *       200:
 *         description: Flashcard successfully added to the deck.
 *       400:
 *         description: Invalid request body or flashcard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invalidFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "front"
 *       401:
 *         description: Unauthorized, user does not own the deck or token is invalid/missing.
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
 *                   example: "Internal Server Error."
 */

flashcardRouter.post('/flashcards/:deckId', isOwnerOfDeck, isFlashCardDataValid, addFlashcardToDeckController);

/**
 * @swagger
 * /api/flashcards/{deckId}/rate:
 *   put:
 *     summary: Update the rating of flashcards in a specific deck
 *     description: This is used when the user rates flashcards after reviewing them. The user must own the deck to perform this action.
 *     tags:
 *       - flashcards
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: ID of the deck containing the flashcards
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 flashcardId:
 *                   type: integer
 *                   description: The ID of the flashcard to update
 *                   example: 21
 *                 mastery:
 *                   type: string
 *                   description: The new mastery level for the flashcard
 *                   example: mastered
 *           example:
 *             - flashcardId: 21
 *               mastery: mastered
 *             - flashcardId: 22
 *               mastery: familiar
 *             - flashcardId: 23
 *               mastery: unsure
 *     responses:
 *       200:
 *         description: Flashcards' rates updated successfully
 *       401:
 *         description: Unauthorized access or not the owner of the deck
 *         content:
 *           application/json:
 *             examples:
 *               unauthorized:
 *                 summary: User is not authenticated
 *                 value:
 *                   message: "Access Denied - Invalid or Expired Tokens"
 *               notOwner:
 *                 summary: User does not own the deck
 *                 value:
 *                   message: "You are not authorized to update this flashcard."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *     security:
 *       - cookieAuth: []
 */

flashcardRouter.put('/flashcards/:deckId/rate',isOwnerOfDeck, updateFlashcardRateController)

/**
 * @swagger
 * /api/flashcards/{deckId}/{flashcardId}:
 *   put:
 *     summary: Update a flashcard in a specific deck
 *     description: Updates the content of a flashcard in a specified deck. The user must own the deck and provide valid flashcard data.
 *     tags:
 *       - flashcards
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: ID of the deck containing the flashcard
 *         schema:
 *           type: string
 *       - in: path
 *         name: flashcardId
 *         required: true
 *         description: ID of the flashcard to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *                 description: The updated front text of the flashcard
 *                 example: "Updated front text"
 *               back:
 *                 type: string
 *                 description: The updated back text of the flashcard
 *                 example: "Updated back text"
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *       400:
 *         description: Invalid input data or update failed
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Validation error in the request body
 *                 value:
 *                   invalidFields: ["front", "back"]
 *               updateFailed:
 *                 summary: Update operation failed
 *                 value:
 *                   message: "Unable to update flashcard. Please try again."
 *       401:
 *         description: Unauthorized access or not the owner of the deck
 *         content:
 *           application/json:
 *             examples:
 *               unauthorized:
 *                 summary: User is not authenticated
 *                 value:
 *                   message: "Access Denied - Invalid or Expired Tokens"
 *               notOwner:
 *                 summary: User does not own the deck
 *                 value:
 *                   message: "You are not authorized to update this flashcard."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *     security:
 *       - cookieAuth: []
 */

flashcardRouter.put('/flashcards/:deckId/:flashcardId', isOwnerOfDeck, isFlashCardDataValid, updateFlashcardController);

/**
 * @swagger
 * /api/flashcards/{deckId}/{flashcardId}:
 *   delete:
 *     summary: Delete a flashcard from a specific deck
 *     description: Deletes a flashcard from a specified deck. The user must own the deck to perform this action.
 *     tags:
 *       - flashcards
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: ID of the deck containing the flashcard to be deleted
 *         schema:
 *           type: string
 *       - in: path
 *         name: flashcardId
 *         required: true
 *         description: ID of the flashcard to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *       400:
 *         description: Failed to delete flashcard
 *       401:
 *         description: Unauthorized access or not the owner of the deck
 *         content:
 *           application/json:
 *             examples:
 *               unauthorized:
 *                 summary: User is not authenticated
 *                 value:
 *                   message: "Access Denied - Invalid or Expired Tokens"
 *               notOwner:
 *                 summary: User does not own the deck
 *                 value:
 *                   message: "You are not authorized to delete this flashcard."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *     security:
 *       - cookieAuth: []
 */

flashcardRouter.delete('/flashcards/:deckId/:flashcardId', isOwnerOfDeck, deleteFlashcardController);

export default flashcardRouter;