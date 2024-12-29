import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import env from 'dotenv'

env.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cramble API',
            version: '1.0.0',
            description: 'A simple and straightforward Express API with Swagger integration for documenting Cramble API endpoints.',
        },
        servers: [
            { 
                url: `https://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` || "https://localhost:3000",
            }
        ],
        tags: [
            {
                name: 'authentication',
                description: 'Everything about authentication.'
            },
            {
                name: 'decks',
                description: 'Everything about decks.'
            },
            {
                name: 'flashcards',
                description: 'Everything about flashcards.'
            },
            {
                name: 'AI generate',
                description: 'Everything about AI generation of flashcards'
            }
        ]
    },
    apis: ['src/routes/*.ts'], // Path to your API routes
};

const specs = swaggerJSDoc(options);

export {specs, swaggerUi}