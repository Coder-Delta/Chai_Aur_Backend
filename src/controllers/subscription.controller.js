import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
  if (subscriberId.toString() === channelId) {
    throw new ApiError(403, "One cannot subscribe to their own channel");
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
      .json(new ApiResponse(200, {}, "Unsubscribed to this channel"));
  }
  // SUBSCRIBE
  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });
  const populatedSubscription = await subscription.populate([
    { path: "subscriber", select: "username avatar fullName" },
    { path: "channel", select: "username avatar fullName" },
  ]);
  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedSubscription, "Subscribed to this channel")
    );
});
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
  // REMOVED PERMISSION CHECK - Allow anyone to see subscriber list
  // This is needed for the frontend to check subscription status
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
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }
  // Allow users to see their own subscriptions
  // You can also make this public if you want
  if (subscriberId !== req.user._id.toString()) {
    throw new ApiError(403, "Permission Denied");
  }
  const subscriberExists = await User.exists({ _id: subscriberId });
  if (!subscriberExists) {
    throw new ApiError(404, "Subscriber not found");
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