import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sql from '../db/db.js'
import OpenAI from "openai";
import {clerkClient} from "@clerk/express";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const generateArticle = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { prompt, length } = req.body;
  const plan = req.plan;
  const free_usage = req.free_usage;

  if (plan !== "premium" && free_usage >= 10) {
    throw new ApiError(
      403,
      "Free usage limit exceeded. Please upgrade to premium plan."
    );
  }

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature:0.7,
    max_tokens:length
  });

  const content=response.choices[0].message.content;

  await sql`INSET INTO creations(user_id,prompt,content,type)
  VALUES(${userId},${prompt},${content},'article')`;

  if(plan!=='premium'){
    await clerkClient.users.updateUserMetadata(userId,{
      publicMetadata:{
        free_usage:free_usage+1
      }
    });
  }

  return res.status(200).json(new ApiResponse(200, "Article generated successfully", content ));

});



export { generateArticle };