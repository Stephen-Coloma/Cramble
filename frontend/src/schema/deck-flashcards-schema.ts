import Joi from "joi";
import { FlashcardsSchema } from "./flashcards-schema";

export const DeckFlashcardsSchema = Joi.object({
  title: Joi.string().min(3).max(30).required().messages({
    "string.empty": "title is required",
    "string.min": "title must be at least 3 characters",
    "string.max": "title cannot exceed 30 characters",
  }),
  description: Joi.string().min(3).max(250).required().messages({
    "string.empty": "description is required",
    "string.min": "description must be at least 3 characters",
    "string.max": "description cannot exceed 250 characters",
  }),
  createdAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "invalid date format",
  }),
  flashcards: Joi.array().items(FlashcardsSchema).min(1).required().messages({
    "array.min": "at least one flashcard is required",
  }),
});
