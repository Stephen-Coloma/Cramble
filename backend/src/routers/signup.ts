import {Router} from 'express'
import signUpController from '../controller/signup'
import isUsernameExists from '../middleware/isUsernameExists ';

const router = Router();

/**
 * Request Body must have data:
 * {
    "first_name": "",
    "last_name": "",
    "username": "",
    "password": "",
    "email": ""
    }   
 */
router.post('/signup', isUsernameExists, signUpController)

export default router;