import mongoose from "mongoose";


const tweetSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    like: {
        type: Array,
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    img:{
        type:String
    },
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now() },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            userDetails: {
                name: String,
                username: String
            }
        }
    ],
    userDetails: {
        type: Array,
        default: []
    }
}, { timestamps: true })


export default mongoose.model("Tweet", tweetSchema);