import { Router } from "express";
import loginController from "../controller/auth/login"
import isLoginDataValid from "../middleware/validation/isLoginDataValid";
import signUpController from '../controller/auth/signup'
import isUsernameExists from '../middleware/isUsernameExists ';
import isSignupDataValid from '../middleware/validation/isSignupDataValid';

const loginRouter = Router();
const signupRouter = Router();

/**
 * Request Body must have data:
 * {
    "username": "",
    "password": "",
    }   
 */
loginRouter.post('/login', isLoginDataValid, loginController)


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
signupRouter.post('/signup', isSignupDataValid, isUsernameExists, signUpController)

export default {loginRouter, signupRouter};