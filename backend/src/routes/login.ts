import { Router } from "express";
import loginController from "../controller/login"

const router = Router();

/**
 * Request Body must have data:
 * {
    "username": "",
    "password": "",
    }   
 */
router.post('/login', loginController)

export default router;