import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";//it is used for agrregation pipeline

const videoSchema = new Schema({
    videoFile :{
        type: String,//cloudnary url
        required: true,
    },
    thumbnail:{
        type:String,//cloudnary url
        required: true,
    },
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    duration:{
        type:Number,//cloudenary
        required: true,
    },
    views:{
        type:Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    videoOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)//pipeline use trhough the plugin to the videoschema

export const Video = mongoose.model("Video",videoSchema)