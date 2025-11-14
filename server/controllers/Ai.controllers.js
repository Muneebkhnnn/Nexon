import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import sql from "../db/db.js";
import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import pdf from "pdf-parse-fork";

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
    temperature: 0.7,
    max_tokens: length,
  });

  const content = response.choices[0].message.content;

  await sql`INSERT INTO creations(user_id,prompt,content,type)
  VALUES(${userId},${prompt},${content},'article')`;

  if (plan !== "premium") {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        free_usage: free_usage + 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Article generated successfully", content));
});

const generateBlogTitle = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { prompt } = req.body;
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
    temperature: 0.7,
    max_tokens: 100,
  });

  const content = response.choices[0].message.content;

  await sql`INSERT INTO creations(user_id,prompt,content,type)
  VALUES(${userId},${prompt},${content},'blog-title')`;

  if (plan !== "premium") {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        free_usage: free_usage + 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Title generated successfully", content));
});

const generateImage = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { prompt, publish } = req.body;
  const plan = req.plan;
  console.log(plan);

  if (plan !== "premium") {
    throw new ApiError(
      403,
      "This Feature is only available for premium users."
    );
  }

  const form = new FormData();
  form.append("prompt", prompt);

  const response = await axios.post(
    "https://clipdrop-api.co/text-to-image/v1",
    form,
    {
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
        ...form.getHeaders(), // <— important for FormData
      },
      responseType: "arraybuffer", // <— correct place
    }
  );

  const base64Image = `data:image/png;base64,${Buffer.from(
    response.data,
    "binary"
  ).toString("base64")}`;

  // we directly destructure img_url from the upload response else it will be cloudinaryResponse.img_url
  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "nexon/images",
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
  }

  await sql`INSERT INTO creations(user_id,prompt,content,type,publish)
    VALUES(${userId},${prompt},${cloudinaryResponse.secure_url},'image',${
    publish ?? false
  })`;

  console.log("Image created and saved successfully!");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Image generated successfully",
        cloudinaryResponse.secure_url
      )
    );
});

const removeImageBackground = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const file = req.file;
  const plan = req.plan;

  if (!file) {
    throw new ApiError(400, "Image is required.");
  }

  if (plan !== "premium") {
    throw new ApiError(
      403,
      "This Feature is only available for premium users."
    );
  }

  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
    folder: "nexon/bg-remove",
    transformation: [
      {
        effect: "background_removal",
      },
    ],
  });

  const secure_url = cloudinaryResponse.secure_url;

  await sql`
    INSERT INTO creations (user_id, prompt, content, type)
    VALUES (
      ${userId},
      'Remove bg from image',
      ${secure_url},
      'image'
    )
  `;

  console.log("Bg removed and saved successfully!");

  return res
    .status(200)
    .json(new ApiResponse(200, "Background removed successfully", secure_url));
});

const removeImageObject = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { object } = req.body;
  const file = req.file;
  const plan = req.plan;

  if (!file) {
    throw new ApiError(400, "Image is required.");
  }

  if (!object.trim()) {
    throw new ApiError(400, "Object name is required.");
  }

  if (plan !== "premium") {
    throw new ApiError(
      403,
      "This Feature is only available for premium users."
    );
  }

  // Convert uploaded image to Base64
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
    folder: "nexon/Img-obj-remove",
    transformation: [
      {
        effect: `gen_remove:${object}`,
      },
    ],
    resource_type: "image",
  });

  const secure_url = cloudinaryResponse.secure_url;

  await sql`
    INSERT INTO creations (user_id, prompt, content, type)
    VALUES (
      ${userId},
      ${`Remove ${object} from image`},
      ${secure_url},
      'image'
    )
  `;

  console.log("obj removed and saved successfully!");

  return res
    .status(200)
    .json(new ApiResponse(200, "object removed successfully", secure_url));
});

const resumeReview = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const file = req.file;
  const plan = req.plan;

  if (!file) {
    throw new ApiError(400, "file is required.");
  }

  if (plan !== "premium") {
    throw new ApiError(
      403,
      "This Feature is only available for premium users."
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError(400, "File size should be less than 5MB.");
  }

  const pdfData = await pdf(file.buffer);

  const prompt = `Review the following resume and provide
constructive feedback on its strengths, weaknesses, and areas for improvement:\n\n${pdfData.text}`;

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  
  await sql`
    INSERT INTO creations (user_id, prompt, content, type)
    VALUES (
      ${userId},
      'Review the uploaded resume',
      ${content},
      'resume-review'
    )
  `;

  console.log("Resume reviewed successfully!");

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume reviewed successfully!", content));
});

export {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
};
