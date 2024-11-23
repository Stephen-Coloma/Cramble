import { Router } from "express";
import loginController from "../controller/login"
import isLoginDataValid from "../middleware/validation/isLoginDataValid";

const router = Router();

/**
 * Request Body must have data:
 * {
    "username": "",
    "password": "",
    }   
 */
router.post('/login', isLoginDataValid, loginController)

export default router;