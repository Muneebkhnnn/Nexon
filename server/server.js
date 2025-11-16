import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import connectCloudinary from "./utils/Cloudinary.js";
import userRouter from "./routes/user.Routes.js";
import aiRouter from "./routes/Ai.Route.js";

dotenv.config();
const app = express();
await connectCloudinary();

app.use(
    cors({
        origin: process.env.CLIENT_URL , 
        credentials: true // Allow cookies to be sent with requests
    })
);

app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 8000;

app.use(requireAuth());

app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/user", userRouter);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port:${PORT}`);
});
