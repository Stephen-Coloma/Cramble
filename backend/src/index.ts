import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config/config';
import loginRouter from './routers/login';
import signupRouter from './routers/signup';
import env from 'dotenv';

// config
env.config();

const hostname = config.server.hostname;
const port = config.server.port;
const app = express();
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY || undefined))
app.use(helmet());

// routers
//prefix: /api/
app.use('/api/', signupRouter)
app.use('/api/', loginRouter)  

//custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port, hostname, () => {
    console.log(`Server listening on port ${port}`);
})