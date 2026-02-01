import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ---------------- GET VIDEO COMMENTS ---------------- */
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

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
        pipeline: [
          { $project: { username: 1, fullName: 1, avatar: 1 } },
        ],
      },
    },
    {
      $unwind: {
        path: "$ownerDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        owner: "$ownerDetails",
      },
    },
    {
      $project: {
        ownerDetails: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

/* ---------------- ADD COMMENT ---------------- */
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId) || !content?.trim()) {
    throw new ApiError(400, "Video id and content are required");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "owner",
    "username fullName avatar"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedComment, "Comment added successfully")
    );
});

/* ---------------- UPDATE COMMENT ---------------- */
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId) || !content?.trim()) {
    throw new ApiError(400, "Valid comment id and content required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // owner check
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to edit this comment");
  }

  comment.content = content;
  await comment.save();

  const populated = await comment.populate(
    "owner",
    "username fullName avatar"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Comment updated successfully"));
});

/* ---------------- DELETE COMMENT ---------------- */
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 🔐 owner check
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};