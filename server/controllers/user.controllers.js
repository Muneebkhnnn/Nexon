import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import sql from "../db/db.js";

const getUserCreations = asyncHandler(async (req, res) => {
  const { userId } = req.auth();

  const creations =
    await sql`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`;

  if (!creations || creations.length === 0) {
    throw new ApiError(404, "No creations found for the user.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User creations fetched successfully.", creations)
    );
});

const getPublicCreations = asyncHandler(async (req, res) => {
  const creations =
    await sql`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All Public creations fetched successfully.",
        creations
      )
    );
});

const toggleLikeCreations = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { creationId } = req.body;

  // remember [{}] this is the format
  const [creations] = await sql`SELECT * FROM creations WHERE id=${creationId}`;

  if (!creations) {
    throw new ApiError(404, "Creation not found.");
  }

  const currentLikes = creations.likes;
  const userIdStr = userId.toString();
  let updatedLikes;
  let message;

  if (currentLikes.includes(userIdStr)) {
    // unlike
    updatedLikes = currentLikes.filter((id) => id !== userIdStr);
    message = "Creation unliked.";
  } else {
    updatedLikes = [...currentLikes, userIdStr];
    message = "Creation liked.";
  }

  await sql`
  UPDATE creations 
  SET likes = ${sql.array(updatedLikes, "text")} 
  WHERE id=${creationId}`;
    

  return res.status(200).json(new ApiResponse(200, message));
});

export { getUserCreations, getPublicCreations, toggleLikeCreations };
