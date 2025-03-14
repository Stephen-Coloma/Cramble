import { Request, Response } from "express";
import { resetCookies } from "../../utilities/resetCookies";

const logoutController = (req: Request, res: Response) =>{
    resetCookies(res);
    res.status(200).json({message: "Logout successful"}).end()
}

export default logoutController
