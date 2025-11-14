import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getPublicCreations, getUserCreations, toggleLikeCreations } from "../controllers/user.controllers.js";

const userRouter=express.Router();

userRouter.get('/get-creations-data',auth,getUserCreations);
userRouter.get('/get-published-creations',auth,getPublicCreations);
userRouter.post('/toggle-Like-Creations',auth,toggleLikeCreations);

export default userRouter;