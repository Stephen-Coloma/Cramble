import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config/config';
import {loginRouter, signupRouter, logoutRouter} from './routers/auth'
import deckRouter from './routers/deck';
import env from 'dotenv';
import verifyToken from './middleware/verifyToken';
import flashcardRouter from './routers/flashcard';

// config
env.config();

const app = express();
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY))
app.use(helmet());

// routers
//prefix: /api
app.use('/auth', loginRouter)
app.use('/auth', signupRouter)
app.use('/auth', logoutRouter)
app.use('/api', verifyToken, deckRouter)
app.use('/api', verifyToken, flashcardRouter)

//custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(config.server.port, config.server.host, () => {
    console.log(`Server listening on port ${config.server.port}`);
})