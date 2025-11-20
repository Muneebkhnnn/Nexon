import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware} from "@clerk/express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import connectCloudinary from "./utils/Cloudinary.js";
import userRouter from "./routes/user.Routes.js";
import aiRouter from "./routes/Ai.Route.js";

dotenv.config();
const app = express();


app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

await connectCloudinary();

app.use(
    cors({
        origin: process.env.CLIENT_URL , 
        credentials: true 
    })
);

app.use(express.json());
app.use(clerkMiddleware());
const PORT = process.env.PORT || 8000;


app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/user", userRouter);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port:${PORT}`);
});
