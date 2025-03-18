import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors'
import config from './config/config';
import env from 'dotenv';
import { specs, swaggerUi } from './api-docs/swagger'
import {loginRouter, signupRouter, logoutRouter, confirmSignupRouter, resendOTPRouter} from './routes/auth'
import deckRouter from './routes/deck';
import flashcardRouter from './routes/flashcard';
import geminiRouter from './routes/gemini';
import verifyCognitoToken from './middleware/verifyCognitoToken';


// env config
env.config();

//cors configuration
const corsOption = {
    origin: `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}

const app = express();
app.use(cors(corsOption))
app.use(bodyParser.json({limit: '500kb'}))
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY))
app.use(helmet());

// routers
app.use('/auth', loginRouter)
app.use('/auth', signupRouter)
app.use('/auth', confirmSignupRouter)
app.use('/auth', resendOTPRouter)
app.use('/auth', verifyCognitoToken, logoutRouter)
app.use('/api', verifyCognitoToken, deckRouter)
app.use('/api', verifyCognitoToken, flashcardRouter)
app.use('/api', verifyCognitoToken, geminiRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(config.server.port, config.server.host, () => {
    console.log(`Server listening on port ${config.server.port}`);
})