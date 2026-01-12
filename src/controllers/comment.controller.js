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
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
      },
    },
    {
      $unwind: {
        path: "$ownerDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        owner: "$ownerDetails"
      }
    },
    {
      $project: {
        ownerDetails: 0
      }
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
});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  if (!videoId || !content) {
    throw new ApiError(404, "All fields are required for comment");
  }
  const userId = req.user?._id;
  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: userId,
  });
  // Populate owner before sending response
  const populatedComment = await Comment.findById(comment._id).populate('owner', 'username fullName avatar');
  return res
    .status(200)
    .json(new ApiResponse(200, populatedComment, "Comment added successfully!"));
});
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
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
    },
    { new: true }
  ).populate('owner', 'username fullName avatar');
  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong when updating the comments")
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated successfully!")
    )
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "CommentId is required!")
  }
  await Comment.findByIdAndDelete(commentId)
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Comment deleted successfully!")
    )
});
export { getVideoComments, addComment, updateComment, deleteComment };