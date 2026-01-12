import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist

  if (!name || !description) {
    throw new ApiError(401, "Name And Description Is Required!");
  }

  const updatedPlaylist = await Playlist.create({
    owner: req.user?._id,
    name: name,
    description: description,
  });

  if (!updatedPlaylist) {
    throw new ApiError(500, "Something went wrong to create the playlist!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "PlayList Created Sucessfully")
    );
}); //complete

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "User id is required");
  }

  const userPlaylist = await Playlist.find({ owner: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "Playlists were fetched successfully")
    );
}); //complete

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!playlistId) {
    throw new ApiError(404, "PlayList id is required");
  }

  const userPlaylist = await Playlist.findById(playlistId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "Playlists were fetched successfully")
    );
}); //complete

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "All fields is required");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { video: videoId } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added successfully"));
}); //complete

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID and Video ID are required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const updatedVideos = playlist.video.filter(
    (v) => v.toString() !== videoId
  );

  if (updatedVideos.length === playlist.video.length) {
    throw new ApiError(404, "Video not found in this playlist");
  }

  playlist.video = updatedVideos;


  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video deleted successfully"));
});//complete


const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  // 2. Delete playlist
  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Playlist deleted successfully")
    );
});//complete


const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        name: name,
        description: description
    }
);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {updatedPlaylist}, "Playlist deleted successfully")
    );
});//complete

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
