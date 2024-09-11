
import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:{
        type:String,
        enum:["follow", "like"],
    },
    read:{
        type:Boolean,
        default:false,
    },
},

    { timestamps: true }
)

export default mongoose.model("Notification", notificationSchema)