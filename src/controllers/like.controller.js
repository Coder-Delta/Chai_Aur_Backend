import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Video unliked successfully"
            )
        );
    }

    // Like the video
    const newLike = await Like.create({
        video: videoId,
        likedBy: userId,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            newLike,
            "Video liked successfully"
        )
    );
});//complete


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Comment unliked successfully"
            )
        );
    }

    // Like the video
    const newLike = await Like.create({
        comment: commentId,
        likedBy: userId,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            newLike,
            "Comment liked successfully"
        )
    );

})//complete

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const userId = req.user._id;

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Tweet unliked successfully"
            )
        );
    }

    // Like the video
    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: userId,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            newLike,
            "Tweet liked successfully"
        )
    )
})//complete

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    { $match: { likedBy: userId, video: { $exists: true, $ne: null } } },

    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "videoOwner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, avatar: 1, email: 1 } }],
            },
          },
          { $unwind: "$owner" },
        ],
      },
    },

    { $unwind: "$videoDetails" },
    { $project: { videoDetails: 1, _id: 0 } },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      likedVideos.map((v) => v.videoDetails),
      "Liked videos fetched successfully"
    )
  );
});//complete

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}