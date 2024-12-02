import { Request, Response } from "express";

const logoutController = (req: Request, res: Response) =>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //false if in development
        signed: true,
    })
    .status(200).json({message: "Logout successful"}).end()
}

export default logoutController
