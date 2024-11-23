import {Router} from 'express'
import signUpController from '../controller/signup'
import isUsernameExists from '../middleware/isUsernameExists ';
import isSignupDataValid from '../middleware/validation/isSignupDataValid';

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
router.post('/signup', isSignupDataValid, isUsernameExists, signUpController)

export default router;