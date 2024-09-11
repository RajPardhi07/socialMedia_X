import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({
    image: {
        type: String,

    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },

}, { timestamps: true })


export default mongoose.model("Image", imageSchema);