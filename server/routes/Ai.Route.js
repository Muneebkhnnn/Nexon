import express, { Router } from "express";
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controllers/Ai.controllers.js";
import {auth} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.js'

const aiRouter= Router();

aiRouter.post('/generate-article',auth,generateArticle)
aiRouter.post('/generate-blog-title',auth,generateBlogTitle)
aiRouter.post('/generate-image',auth,generateImage)
aiRouter.post('/remove-image-background',auth,upload.single('image'),removeImageBackground)
aiRouter.post('/remove-image-object',auth,upload.single('image'),removeImageObject)
aiRouter.post('/resume-review',auth,upload.single('resume'),resumeReview)

export default aiRouter;