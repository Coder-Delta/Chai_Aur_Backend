import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateComment } from "./comment.controller.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "Tweet is required!");
  }

  const user = req.user?._id;

  const createTweet = await Tweet.create({
    content: content,
    owner: user,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createTweet, "Tweet posted successfully"));
}); //complete

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(500, "User not found");
  }

  const tweets = await Tweet.find(
    {
        owner: userId,
    }
  )

  if (!tweets) {
    throw new ApiError(500, "Something went wrong");
  }

  return res.status(200).json(new ApiResponse(200, tweets));
});//complete

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const {tweetId} = req.params;
  const {content} = req.query;

  if (!tweetId) {
    throw new ApiError(404, "tweetId is missing")
  }

  if (!content) {
    throw new ApiError(404, "Tweet is missing")
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{content:content})

  return res
  .status(200)
  .json(
    new ApiResponse(200,updatedTweet,"Tweet updated successfully.")
  )
});//complete

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const {tweetId} = req.params;

  if (!tweetId) {
    throw new ApiError(404, "tweetId is missing")
  }

  await Tweet.findByIdAndDelete(tweetId)

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Tweet updated successfully.")
  )
});//complete

export { createTweet, getUserTweets, updateTweet, deleteTweet };
