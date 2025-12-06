import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const channelObjectId = new mongoose.Types.ObjectId(channelId);

  const totalVideos = await Video.countDocuments({ videoOwner: channelObjectId });

  const totalSubscribers = await Subscription.countDocuments({ channel: channelObjectId });

  const viewsAgg = await Video.aggregate([
    { $match: { videoOwner: channelObjectId } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

  const likesAgg = await Like.aggregate([
    { $match: { video: { $exists: true } } },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoData",
      },
    },
    { $unwind: "$videoData" },
    { $match: { "videoData.videoOwner": channelObjectId } },
    { $count: "totalLikes" },
  ]);
  const totalLikes = likesAgg[0]?.totalLikes || 0;

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalSubscribers,
      totalViews,
      totalLikes,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const videos = await Video.find({
    videoOwner: new mongoose.Types.ObjectId(channelId),
  }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos));
});

export { getChannelStats, getChannelVideos };
