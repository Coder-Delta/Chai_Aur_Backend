import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(404, "Video Id Is Required");
  }

  // Create aggregation pipeline
  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
        // Convert videoId => ObjectId
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, avatar: 1 } }],
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  // Pagination Options
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  // Execute paginated aggregation
  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
}); //complete

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  // console.log(videoId, content, req.user?._id);

  if (!videoId || !content) {
    throw new ApiError(404, "All fields are required for comment");
  }

  const userId = req.user?._id;

  const user = await Comment.create({
    content: content,
    video: videoId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Comment added successfully!"));
});//complete

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const{commentId} = req.params;
  const{content} = req.query;

  if (!commentId) {
    throw new ApiError(404, "CommentId is required!")
  }

  if (!content) {
    throw new ApiError(404, "New comment is required")
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: content,
    }
  ).select("-owner")

  if (!updatedComment) {
    throw new ApiError(500,"Something went wrong when updating the comments")
  }
  

  return res
  .status(200)
  .json(
    new ApiResponse(200,updatedComment,"Comment updated successfully!")
  )
});//complete

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const{commentId} = req.params;

  if (!commentId) {
    throw new ApiError(404, "CommentId is required!")
  }

  await Comment.findByIdAndDelete(commentId)

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Comment updated successfully!")
  )

});//Done

export { getVideoComments, addComment, updateComment, deleteComment };
