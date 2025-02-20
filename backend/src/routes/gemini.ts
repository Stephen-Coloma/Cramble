import { Router } from "express";
import generateFlashcardController from "../controller/gemini/generateFlashcard";

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
 *               {
 *                  "title": "Your Title Here",
 *                  "description": "Your description here",
 *                  "flashcards": [
 *                        {
 *                           "front": "Question here",
 *                           "back": "Answer here"
 *                        },
 *                        {
 *                          "front": "Question here",
 *                          "back": "Answer here"
 *                        }
 *                   ]
 *               }  
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
export default geminiRouter;