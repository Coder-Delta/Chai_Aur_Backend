import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genaretAccessToken();
    const refreshToken = user.genaretRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //4 parameter err, req, res, next
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

  const { fullName, email, username, password } = req.body;
  // console.log("email:", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fileds are required.");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "An User Allready Exist With The Same Username Or Email"
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //upload the img on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar uploading was unsuccesfull");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //remove unwanted fields

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find the user
  //password cheak
  //access nad refresh token
  //send cookies

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    //or use (!(username || email))
    throw new ApiError(400, " Username or Email Is Required ");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  //when send data to user we can use two ways 1) call db again 2) update the user obj with accessToken and refereshToken
  //we can use 2nd option if db is expensive then we can update the obj.
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //.select string me jo kuch nahi chahata hu who likh do

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          loggedInUser,
        },
        "User loggend in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //clear the cookie from the user db and the db
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refereshToken: undefined,
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json(new ApiResponse(200, {}, "User loggedout successfully"));
});

export { registerUser, loginUser, logoutUser }; //import me me iss name se hi import kar sakta hu
