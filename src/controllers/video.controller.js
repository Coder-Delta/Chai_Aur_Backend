import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination

  //Algorithm
  //Extract the data from req to destructure the body
  //verifyjwt
  //Search the req videos along the user's query
  //shortBy (views or createdBy) user's specification
  //short acending or decending order based on req
  //JSON req send to the user
  // const query = MyModel.find(); // `query` is an instance of `Query`
  // query.setOptions({ lean: true });
  // query.collection(MyModel.collection);
  // query.where("age").gte(21).exec(callback);

  try {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    // console.log(req.query)
    //uncomplete
    const filter = {
      $or: [{ title: query }, { $text: { $search: query } }],
    };

    const video = await Video.find(filter).setOptions({ lean: true });
    console.log(video);

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video feached successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong in the sesrching time");
  }
}); //uncomplete

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  //videFIle upload
  const videoLocalpath = req.files?.videoFile?.[0]?.path; // FIXED NAME
  if (!videoLocalpath) {
    throw new ApiError(400, "Video is missing");
  }

  const video = await uploadOnCloudinary(videoLocalpath);

  if (!video) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the video file"
    );
  }

  //thumbnail
  const thumbnailLocalpath = req.files?.thumbnail?.[0]?.path;
  if (!thumbnailLocalpath) {
    throw new ApiError(400, "Thumbnail is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalpath);

  if (!thumbnail) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the Thumbnail file"
    );
  }

  //get the duration time from cloudinary
  // const videoFile = await Video.findById(req?._id)

  const createdVideoFile = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: video.duration,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createdVideoFile, "Video File Upload successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
