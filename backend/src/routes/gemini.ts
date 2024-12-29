import { Router } from "express";
import generateFlashcardController from "../controller/gemini/generateFlashcard";
import saveGeneratedFlashcardController from '../controller/gemini/saveGeneratedFlashcards'
import isGeneratedFlashcardsDataValid from "../middleware/validation/isGeneratedFlashcardsDataValid";

const geminiRouter = Router();

/**
 * @swagger
 * /api/gemini/generate:
 *   post:
 *     summary: Generate flashcards based on provided text
 *     description: Generates a set of flashcards derived from the input text using the Gemini AI model. The flashcards are returned in JSON format.
 *     tags:
 *       - AI generate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The source text for generating flashcards
 *                 example: "The mitochondria is the powerhouse of the cell."
 *               count:
 *                  type: number
 *                  description: Maximum number of flashcards to be generated. If greater than 50, count will be 10 (default).
 *                  exampple: 10
 *     responses:
 *       200:
 *         description: Successfully generated flashcards
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "front": "What is the mitochondria known for?",
 *                   "back": "The powerhouse of the cell."
 *                 },
 *                 {
 *                   "front": "What is the primary role of the mitochondria?",
 *                   "back": "To generate energy for the cell."
 *                 }
 *               ]
 *       400:
 *         description: Invalid input or malformed request
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid input. Please provide valid text."
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *       500:
 *         description: Server error or Gemini API failure
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *     security:
 *       - cookieAuth: []
 */

geminiRouter.post('/gemini/generate', generateFlashcardController)
/**
 * @swagger
 * /api/gemini/save:
 *   post:
 *     summary: Save generated flashcards to the database
 *     description: This endpoint allows users to save a deck with associated flashcards to the database. The request body must include the deck title, description, creation date, and a list of flashcards with front and back text.
 *     tags:
 *       - AI generate
 *     security:
 *       - cookieAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the deck
 *                 example: "Learning AWS Cloud Platform"
 *               description:
 *                 type: string
 *                 description: A description of the deck
 *                 example: "This deck contains all important details about AWS."
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date the deck was created
 *                 example: "2024-12-29T12:00:00Z"
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     front:
 *                       type: string
 *                       description: The front text of the flashcard
 *                       example: "Who is the CEO of AWS?"
 *                     back:
 *                       type: string
 *                       description: The back text of the flashcard
 *                       example: "Jeff Bezos"
 *                 description: An array of flashcards to be added to the deck
 *     responses:
 *       200:
 *         description: Successfully saved the deck and flashcards
 *       400:
 *         description: Invalid input or malformed request
 *         content:
 *           application/json:
 *             example:
 *               message: "Error saving generated flashcards"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *       500:
 *         description: Server error or Gemini API failure
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */
geminiRouter.post('/gemini/save', isGeneratedFlashcardsDataValid, saveGeneratedFlashcardController);

export default geminiRouter;