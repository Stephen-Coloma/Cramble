import Joi from "joi";

export const generateFlashcardsSchema = Joi.object({
    text: Joi.string().required().min(1500),

    count: Joi.number().required().min(10),
});