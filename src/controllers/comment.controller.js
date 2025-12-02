import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

//     const options = {
//     page: 1,
//     limit: 10
// };

// var myAggregate = myModel.aggregate();
// myModel.aggregatePaginate(myAggregate, options, function(err, results) {
// 	if(err) {
// 		console.err(err);
// 	else {
//     	console.log(results);
// 	}
// })
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }