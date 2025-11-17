import { v2 as cloudinary } from "cloudinary"; //in here "as" coustomize the v2 to cloudnary
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) return null
        //upload file on cloudenary
        const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type: "auto",
        })
        //file has been uploaded successfull
        console.log("File uploaded on cloudinary", response.url);
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilepath)//remove the locally saved temp file as upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}