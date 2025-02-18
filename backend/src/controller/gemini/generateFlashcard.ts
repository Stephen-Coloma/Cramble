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
    const count = (req.body.count > 50 || req.body.count < 1) ? 10 : req.body.count; //default count = 10 

    const prompt = `
        Act like a teacher or a professor, Based from the text below, create a flashcard 
        questionnaire with a total number of ${count} items. It is absolute that you must follow the total count.
        provide a title with a minimum of 3 and a maximum of 30 characters. 
        provide a description that is about what is included in the topic with a minimum of 3 and a maximum of 250 characters. 

        "${text}"

        IMPORTANT! 
        1. Follow this JSON String format on your return always
        2. remove the "\`\`\`json\`\`\` on each ends. 
        3. pretty printing is disabled

        {
            "title": "Your Title Here",
            "description": "Your description here",
            "flashcards": [
                {
                    "front": "Question here",
                    "back": "Answer here"
                },
                {
                    "front": "Question here",
                    "back": "Answer here"
                }
            ]
        }    
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