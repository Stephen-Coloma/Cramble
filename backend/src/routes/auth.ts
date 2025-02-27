import { Router } from "express";
import loginController from "../controller/auth/login"
import signUpController from '../controller/auth/signup'
import isUsernameExists from '../middleware/isUsernameExists ';
import isSignupDataValid from '../middleware/validation/isSignupDataValid';
import logoutController from "../controller/auth/logout";
import verifyToken from "../middleware/verifyToken";
import isEmailExists from "../middleware/isEmailExists";
import confirmSignupController from "../controller/auth/confirmSignup";

const loginRouter = Router();
const signupRouter = Router();
const confirmSignupRouter = Router();
const logoutRouter = Router();

/**
 * @swagger
 * /auth/login:
 *     post:
 *       summary: User login
 *       description: Authenticates a user and returns a JWT token if login is successful.
 *       tags:
 *         - authentication
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: User's username
 *                   example: johndoe123
 *                 password:
 *                   type: string
 *                   description: User's password
 *                   example: P@ssw0rd123
 *               required:
 *                 - username
 *                 - password
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Login successful
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Incorrect password or Username not found
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Internal Server Error
 */
loginRouter.post('/login', loginController)

/**
 * @swagger
 * /auth/signup:
 *     post:
 *       summary: User signup
 *       description: Registers a new user in the system.
 *       tags:
 *         - authentication
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                   example: Doe
 *                 username:
 *                   type: string
 *                   description: User's username
 *                   example: johndoe123
 *                 password:
 *                   type: string
 *                   description: User's password
 *                   example: P@ssw0rd123
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                   example: johndoe@example.com
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - username
 *                 - password
 *                 - email
 *       responses:
 *         '201':
 *           description: User created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User created successfully
 *         '400':
 *           description: Invalid input data
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   invalidFields:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["firstName", "email"]
 *         '406':
 *           description: Username already taken
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Username already taken
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Internal Server Error
 */
signupRouter.post('/signup', isSignupDataValid, isUsernameExists, isEmailExists, signUpController)

confirmSignupRouter.post('/confirm', confirmSignupController)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: "Logs out the user by clearing the authentication token"
 *     description: "This endpoint logs out the user by clearing the JWT token from the signed cookies."
 *     operationId: "logoutUser"
 *     tags:
 *       - "authentication"
 *     responses:
 *       '200':
 *         description: "Logout successful"
 *         content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                     example: "Logout successful"
 *       '401':
 *         description: "Unauthorized - No token provided or invalid token"
 *         content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                     example: "Logout successful"       
 *       '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Internal Server Error
 */
logoutRouter.post('/logout', verifyToken, logoutController)

export {loginRouter, signupRouter, confirmSignupRouter, logoutRouter};