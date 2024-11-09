import express from 'express';
import config from './config/config'
import loginRouter from './routes/login'
import signupRoute from './routes/signup'
import homepageRouter from './routes/homepage'

// config
const hostname = config.server.hostname;
const port = config.server.port;
const app = express();

// routers
//prefix: /api/
app.use('/api/', loginRouter)  
app.use('/api/', signupRoute)
app.use('/api/', homepageRouter)

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)    
})