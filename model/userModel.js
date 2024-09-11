import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    work: {
        type: String,

    },
    location: {
        type: String,
    },
    myTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    profileImg: {
        type: String,
        default: "",

    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "......."
    },
    bookmarks: [{
        tweetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet"
        },
        created: { type: Date, default: Date.now() },

        tweetDetails: {
            description: String,
            likes: {
                type: Array,
                default: []
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
                name: String,
                username: String,

                userId: {
                  type: mongoose.Schema.Types.ObjectId, ref: "User"
                },


            }
        }
    }]
}, { timestamps: true })


export default mongoose.model("User", userSchema);