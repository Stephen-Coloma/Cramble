import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config/config';
import authRoutes from './routers/auth'
import decksRouter from './routers/decks';
import env from 'dotenv';
import verifyToken from './middleware/verifyToken';

// config
env.config();

const app = express();
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY))
app.use(helmet());

// routers
//prefix: /api
app.use('/auth', authRoutes.loginRouter)
app.use('/auth', authRoutes.signupRouter)
app.use('/api', verifyToken, decksRouter)

//custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(config.server.port, config.server.host, () => {
    console.log(`Server listening on port ${config.server.port}`);
})