import { Router } from "express";
import generateFlashcardController from "../controller/gemini/generateFlashcard";

const geminiRouter = Router();

/**
 * @swagger
 * /api/gemini/flashcards/generate:
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
 *               message: "Access denied."
 *       500:
 *         description: Server error or Gemini API failure
 *         content:
 *           application/json:
 *             example:
 *               message: "An unexpected error occurred while generating flashcards."
 *     security:
 *       - cookieAuth: []
 */

geminiRouter.post('/gemini/flashcards/generate', generateFlashcardController)

export default geminiRouter;