import { Router } from "express";
import loginController from "../controller/auth/login"
import signUpController from '../controller/auth/signup'
import isUsernameExists from '../middleware/isUsernameExists ';
import isSignupDataValid from '../middleware/validation/isSignupDataValid';
import logoutController from "../controller/auth/logout";
import isEmailExists from "../middleware/isEmailExists";
import confirmSignupController from "../controller/auth/confirmSignup";
import resendOTPController from "../controller/auth/resendOTP";

const loginRouter = Router();
const signupRouter = Router();
const confirmSignupRouter = Router();
const resendOTPRouter = Router();
const logoutRouter = Router();

/**
* @swagger
*   /auth/login:
*     post:
*       summary: User login
*       description: Authenticates a user and returns JWT tokens if login is successful.
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
*                   accessToken:
*                     type: string
*                     description: Cognito Access Token
*                   refreshToken:
*                     type: string
*                     description: Cognito Refresh Token
*                   expiresIn:
*                     type: integer
*                     description: Expiry time in seconds
*                   jwtToken:
*                     type: string
*                     description: Custom JWT Token
*         '401':
*           description: Unauthorized - Incorrect password or username not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Incorrect username or password.
*         '412':
*           description: Precondition Failed - User not confirmed
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   username:
*                     type: string
*                     description: User's username
*                     example: johndoe123
*                   email:
*                     type: string
*                     description: User's email that is unconfirmed in the database
*                     example: johndoe@123
*                 required:
*                   - username
*                   - email
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
*
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
 *           description: User created successfully. Verify account so that it can be used.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User created successfully. Please verify account
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
 *               examples:
 *                  username exists:
 *                    summary: Username is already taken in the application
 *                    value:
 *                      message: "Username already taken"
 *                  email exists:
 *                    summary: Email is already taken in the application
 *                    value:
 *                      message: "Email already taken'"
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

/**
 * @swagger
* /auth/signup/confirm:
*     post:
*       summary: Confirm user signup
*       description: Confirms a user's signup by verifying the confirmation code.
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
*                 confirmationCode:
*                   type: string
*                   description: Confirmation code received via email
*                   example: "123456"
*               required:
*                 - username
*                 - confirmationCode
*       responses:
*         '200':
*           description: Account verified successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Account Verified
*         '400':
*           description: Bad Request - Incorrect confirmation code
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Confirmation code is incorrect
*         '406':
*           description: Not Acceptable - Confirmation code expired
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Confirmation code expired
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
*
*/
confirmSignupRouter.post('/signup/confirm', confirmSignupController)


/**
 * @swagger
* /auth/otp/resend:
*     post:
*       summary: Confirm user signup
*       description: Confirms a user's signup by verifying the confirmation code.
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
*               required:
*                 - username
*       responses:
*         '200':
*           description: A new code has been delivered successfuly.
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: New code sent
*         '500':
*           description: Might be code delivery failure, too much request etc. Refer to the docs of class ResendConfirmationCodeCommand in AWS SDK javascript v3
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Internal Server Error
*/
resendOTPRouter.post('/otp/resend', resendOTPController)

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
 *                     example: "Access Denied - Invalid or Expired Tokens"       
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
logoutRouter.post('/logout', logoutController)

export {loginRouter, signupRouter, confirmSignupRouter, resendOTPRouter, logoutRouter};