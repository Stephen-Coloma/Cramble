import express, { Request, Response } from 'express';
import env from 'dotenv'
import loginRouter from './routes/login'
import signupRoute from './routes/signup'

// config
env.config();

const app = express();
const HOST = process.env.HOST as string;
const PORT = parseInt(process.env.PORT as string);

// routers
//prefix: /api/auth
app.use('/api/', loginRouter)  
app.use('/api/', signupRoute)


// homepage
app.get('/', (req: Request, res: Response) => {
    res.send('HOMEPAGE')
})

app.listen(PORT, HOST, () => {
    console.log(`Example app listening on port ${PORT}`)
})