import{asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from"../utils/apiError.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import{ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {//4 parameter err, req, res, next
    // res.status(200).json({
    //     message: "Ok"
    // })
    
    //Algorithm for registration
    
    //get user details from frontend
    //validation - not empty
    //cheak if user already exists:username,email
    //cheak for images,cheak for avatar
    //create user object -create entry the data in db
    //remove password and refresh token field from the response
    //cheak for user creation 
    //return result

    const {fullName,email,userName,password} = req.body
    console.log("email:", email);

    if (
        [fullName,email,userName,password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fileds are required.")
    }

    const existedUser = User.findOne({
        $or: [{ userName },{ email }]
    })
    if (existedUser) {
        throw new ApiError (409, "An User Allready Exist With The Same Username Or Email")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError ( 400 ,"Avatar file is required")
    }

    //upload the img on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError ( 400 ,"Avatar uploading was unsuccesfull")
    }

    const user = User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )//remove unwanted fields

    if (!createdUser) {
        throw new ApiError(500 ,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse (200, createdUser,"User Registered successfully")
    )
})

export {registerUser}//import me me iss name se hi import kar sakta hu