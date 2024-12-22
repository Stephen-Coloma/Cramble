import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Cramble API',
        version: '1.0.0',
        description: 'A simple Express API with Swagger documentation used to document Cramble API endpoints.',
        },
    },
    apis: ['src/routes/*.ts'], // Path to your API routes
};

const specs = swaggerJSDoc(options);

export {specs, swaggerUi}