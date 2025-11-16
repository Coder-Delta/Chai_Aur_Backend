import mongoose, { Mongoose } from "mongoose";
import jwt from"jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // index true karna jada benifit hoga agar searching ke liya hum database use karunga.
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudenary ka url use karunga
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestaps: true }
);

userSchema.pre("save",async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password,10)
  next()
}
)//in here we use the function not arrow func because we know arrow function doesn't has this keyword contex nahi pata hoga

//coustom methods(userSchema.methods.methodName)
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.genaretAccessToken = function(){
  return jwt.sign({
    _id : this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  }),
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiryIn: process.env.ACCESS_TOKEN_EXPIRY
  }
}

userSchema.methods.genaretRefreshToken = function(){
  return jwt.sign({
    _id : this._id,
  }),
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiryIn: process.env.REFRESH_TOKEN_EXPIRY
  }
}

userSchema.methods.genaretRefreshToken = async function(){}

export const User = mongoose.model("User", userSchema); //mongodb me users name par save hoga
