import Joi from "joi";

export const FlashcardsSchema = Joi.object({
  front: Joi.string().min(1).max(400).required().messages({
    "string.empty": "question is required",
    "string.min": "question must be at least 1 character",
    "string.max": "question cannot exceed 400 characters",
  }),
  back: Joi.string().min(1).max(400).required().messages({
    "string.empty": "answer is required",
    "string.min": "answer must be at least 1 character",
    "string.max": "answer cannot exceed 400 characters",
  }),
});
