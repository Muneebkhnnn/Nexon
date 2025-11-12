import express, { Router } from "express";
import { generateArticle } from "../controllers/Ai.controllers.js";
import {auth} from '../middleware/auth.middleware.js'

const router= Router();

router.post('/generate-article',auth,generateArticle)

export default router;