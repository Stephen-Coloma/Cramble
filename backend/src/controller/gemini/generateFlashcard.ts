import { Request, Response } from "express";

import { GoogleGenerativeAI } from "@google/generative-ai";
import sendErrorToClient from "../../utilities/errorHandler";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'null');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const generateFlashcardController = async(req: Request, res: Response) =>{
    /**TODO:
     * 1. Implement too many tokens on the request payload/text
     * 2. implement controller for matic adding of deck and flashcards to that deck
     * 3. MYSQL is thread safe!
     */

    const text = req.body.text;
    const max = 40;

    const prompt = `
        Based from the text below, create a flashcard questionnaire with maximum of ${max} items. 
        Only create meaningful flashcards, do not meet the max if not needed.

        "${text}"

        IMPORTANT! 
        1. Follow this JSON String format on your return always
        2. remove the "\`\`\`json\`\`\` on each ends. 
        3. pretty printing is disabled

        [
            {
                "front": "Question here",
                "back": "Answer here"
            },
            {
                "front": "Question here",
                "back": "Answer here"
            }
        ]    
    `;
    try{
        const result = await model.generateContent(prompt);
        const parsedJSON = JSON.parse(result.response.text())
        res.status(200).json(parsedJSON);
    }catch(error: unknown){
        sendErrorToClient(error, res)
    }
}

export default generateFlashcardController;