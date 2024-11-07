import express, { Request, Response } from 'express';
import env from 'dotenv'

env.config();

const app = express();
const HOST = process.env.HOST as string;
const PORT = parseInt(process.env.PORT as string);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world')
})

app.listen(PORT, HOST, () => {
    console.log(`Example app listening on port ${PORT}`)
})

