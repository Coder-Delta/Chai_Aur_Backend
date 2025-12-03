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
}); //uncomplete i want to add ai search engine and recomandation

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
  const user = await req.user;

  const createdVideoFile = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: video.duration,
    videoOwner: user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdVideoFile, "Video File Upload successfully")
    );
}); //complete

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  // console.log(videoId)

  if (!videoId?.trim()) {
    throw new ApiError(404, "Video id is required!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(500, " Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video feached successfully"));
}); //complete

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId, title, description, thumbnail } = req.body;
  //TODO: update video details like title, description, thumbnail
  if (!videoId?.trim()) {
    throw new ApiError(404, "Video id is required!");
  }

  const video = await Video.findByIdAndUpdate(videoId, {
    title: title,
    description: description,
    thumbnail: thumbnail,
  }); //uncomplete

  if (!video) {
    throw new ApiError(500, " Something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Update successfully done"));
}); //complete

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId?.trim()) {
    throw new ApiError(404, "Video id is required!");
  }
  console.log(videoId);

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(500, " Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
}); //complete

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log(req.user?._id)

  const video = await Video.findById(videoId);

  // const owner = String(video.videoOwner);
  // const user = String(req.user?._id);

  // if (!video.isPublished && owner === user) {
  //   console.log("Control is here!")
  //   throw new ApiError(403, "This is a private video");
  // }//need to cheak it doeasn't work properly

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: { isPublished: !video.isPublished }, // your toggle logic kept same
      },
      { new: true } // fixed: valid option here
    );

    if (!updatedVideo) {
      throw new ApiError(500, "Update failed");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedVideo, "Your state changed successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});//Complete But Need some improvement on the secure login

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
