import express, { Router } from "express";
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controllers/Ai.controllers.js";
import {auth} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.js'
import { requireAuth } from "@clerk/express";

const aiRouter= Router();

aiRouter.post('/generate-article',requireAuth(),auth,generateArticle)
aiRouter.post('/generate-blog-title',requireAuth(),auth,generateBlogTitle)
aiRouter.post('/generate-image',requireAuth(),auth,generateImage)
aiRouter.post('/remove-image-background',requireAuth(),auth,upload.single('image'),removeImageBackground)
aiRouter.post('/remove-image-object',requireAuth(),auth,upload.single('image'),removeImageObject)
aiRouter.post('/resume-review',requireAuth(),auth,upload.single('resume'),resumeReview)

export default aiRouter;