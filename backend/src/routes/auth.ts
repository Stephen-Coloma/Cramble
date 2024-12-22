import { Router } from "express";
import loginController from "../controller/auth/login"
import isLoginDataValid from "../middleware/validation/isLoginDataValid";
import signUpController from '../controller/auth/signup'
import isUsernameExists from '../middleware/isUsernameExists ';
import isSignupDataValid from '../middleware/validation/isSignupDataValid';
import logoutController from "../controller/auth/logout";
import verifyToken from "../middleware/verifyToken";

const loginRouter = Router();
const signupRouter = Router();
const logoutRouter = Router();

/**
 * @swagger
 * /auth/login:
 *    post: 
 *       summary: Hello
 *       responses:
 *          200:
 *             description: a successful response
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
logoutRouter.post('/logout', verifyToken, logoutController)

export {loginRouter, signupRouter, logoutRouter};