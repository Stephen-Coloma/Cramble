import Joi from "joi";

export const DeckSchema = Joi.object({
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
  editedAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "invalid date format",
  }),
});
