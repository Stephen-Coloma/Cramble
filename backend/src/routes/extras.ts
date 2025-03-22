import { Router } from "express";
import getUserDetailsController from "../controller/extras/getUserDetails";

const extrasRouter = Router();

extrasRouter.get('/extras/user/details', getUserDetailsController);

export default extrasRouter;