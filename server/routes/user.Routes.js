import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getPublicCreations, getUserCreations, toggleLikeCreations } from "../controllers/user.controllers.js";
import { requireAuth } from "@clerk/express";

const userRouter=express.Router();

userRouter.get('/get-creations-data',requireAuth(),auth,getUserCreations);
userRouter.get('/get-published-creations',requireAuth(),auth,getPublicCreations);
userRouter.post('/toggle-Like-Creations',requireAuth(),auth,toggleLikeCreations);

export default userRouter;