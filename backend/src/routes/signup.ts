import {Request, Response, Router} from 'express'
const router = Router();

router.get('/signup', (req: Request, res: Response)=>{
    res.send('SIGN UP PAGE!')
})

export default router;