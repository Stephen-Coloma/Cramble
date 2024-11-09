import {Request, Response, Router} from 'express'
import signUpController from '../controller/signup'
import isUsernameExists from '../middleware/isUsernameExists ';

const router = Router();

router.post('/signup', isUsernameExists,signUpController)

export default router;