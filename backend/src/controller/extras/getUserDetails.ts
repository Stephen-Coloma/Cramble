import { Request, Response } from "express";
import { databaseInstance as Database } from "../../database/mysql";
import sendErrorToClient from "../../utilities/errorHandler";

/**An api endpoint that fetches user details listed in the database */
const getUserDetailsController = async (req: Request, res: Response) =>{
    //obtain userID
    const userId = req.userId;

    const queryString = `
        SELECT first_name, last_name, username, email, created_at, last_login, status
        FROM users
        WHERE user_id = ?
    `
    const values = [userId]

    try{
        const connection = await Database.connect();
        const [result] = await Database.processQuery(connection, queryString, values);

        if (!result) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            firstName: result.first_name,
            lastName: result.last_name,
            username: result.username,
            email: result.email,
            createdAt: result.created_at,
            lastLogin: result.last_login,
            status: result.status, // Fixed typo (was "stasus")
        })
    }catch(error: unknown){
        console.log(error);
        sendErrorToClient(error, res)
    }
}

export default getUserDetailsController;