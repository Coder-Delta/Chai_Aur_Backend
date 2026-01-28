import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ---------------- TOGGLE SUBSCRIPTION ---------------- */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  if (subscriberId.toString() === channelId) {
    throw new ApiError(403, "You cannot subscribe to your own channel");
  }

  const channelExists = await User.exists({ _id: channelId });
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  // UNSUBSCRIBE
  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  }

  // SUBSCRIBE
  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  const populated = await subscription.populate([
    { path: "subscriber", select: "username avatar fullName" },
    { path: "channel", select: "username avatar fullName" },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Subscribed successfully"));
});

/* ---------------- GET CHANNEL SUBSCRIBERS ---------------- */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const channelExists = await User.exists({ _id: channelId });
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }

  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscriber: { $first: "$subscriber" },
      },
    },
    {
      $project: {
        subscriber: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriptions, "Subscribers fetched successfully")
    );
});

/* ---------------- GET USER SUBSCRIPTIONS ---------------- */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }

  if (subscriberId !== req.user._id.toString()) {
    throw new ApiError(403, "Permission denied");
  }

  const userExists = await User.exists({ _id: subscriberId });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedTo",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribedTo: { $first: "$subscribedTo" },
      },
    },
    {
      $project: {
        subscribedTo: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriptions,
        "Subscribed channels fetched successfully"
      )
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};