import userModel from "../model/userModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tweetModel from "../model/tweetModel.js";
import { v2 as cloudinary } from "cloudinary";


export const registerController = async (req, res) => {
    try {
        const { name, email, password, username, location, work, bio, coverImg, ProfileImg } = req.body;

        const user = await userModel.findOne({ email })
        if (user) {
            return res.status(200).send({
                success: true,
                message: "User already exited"
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 16);

        const newUser = await userModel.create({
            name,
            username,
            email,
            password: hashedPassword,
            work,
            location,
            bio,
            ProfileImg,
            coverImg
        })
        res.status(201).json({
            success: true,
            message: "User created Successfully",
            newUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Register user"
        })
    }
}



export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                message: "Email and Password required",
                success: true
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: true,
                message: "Incorrect Credencials"
            })
        }
        const isMatch = bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({
                message: "Wrong credentials",
                success: true
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: "Login Successfully",
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Login user"
        })
    }
}


export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id)
        res.status(200).json({
            success: true,
            message: "User get successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while get user"
        })
    }
}

export const editController = async (req, res) => {
    try {
        const { id } = req.params;

        const data = req.body;

        const editUser = await userModel.findByIdAndUpdate(id, data, { new: true }).select("-password")
        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            editUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Edit user"
        })
    }
}


export const logoutController = (req, res) => {

    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "User Logged out Successfully",
        success: true
    })
}





export const bookmarks = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;

        const tweet = await tweetModel.findById(tweetId)
            .populate('userId', 'name username')
            .populate('comments.userId', 'name username')
        const user = await userModel.findById(loggedInUserId)

        if (!user || !tweet) {
            return res.status(404).json({
                message: "User Tweet not found",
                success: true
            })
        }
        // Check if the tweet is already bookmarked
        const bookmark = user.bookmarks.find(bm => bm.tweetId && bm.tweetId.toString() === tweetId)

        if (bookmark) {
            // Remove the bookmark if it already exists
            await userModel.findByIdAndUpdate(loggedInUserId, {
                $pull: { bookmarks: { tweetId } }
            });
            return res.status(404).json({
                message: "Remove post"
            })

        }
        else {
            await userModel.findByIdAndUpdate(loggedInUserId, {
                $push: {
                    bookmarks: {
                        tweetId,
                        profileImg:user.bookmarks.profileImage,
                        tweetDetails: {
                            description: tweet.description,
                            likes: tweet.like,
                            comments: tweet.comments,
                            userDetails: {
                                name: tweet.userId.name,
                                username: tweet.userId.username,
                                userId: tweet.userId._id,
                               
                            }
                        }
                    }
                }
            })
            return res.status(200).json({
                message: "Saved Post",
                success: true
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Saved tweet"
        })
    }
}




export const getBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('bookmarks');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const bookmarks = user.bookmarks.map(bookmark => ({
            tweetId: bookmark.tweetId,
            created: new Date(),
            description: bookmark.tweetDetails.description,
            likes: bookmark.tweetDetails.likes,
            comments: bookmark.tweetDetails.comments, 
            userDetails: bookmark.tweetDetails.userDetails
        }));

        res.status(200).json({
            message: "Fetched All bookmarks",
            success: true,
            bookmarks
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Saved tweet"
        })
    }
}






export const getMyProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).select("-password")
        res.status(200).json({
            message: "User found successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Saved tweet"
        })
    }
}


export const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const otherusers = await userModel.find({ _id: { $ne: id } }).select("-password")
        res.status(200).json({
            otherusers
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while get others users"
        })
    }
}




export const followController = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await userModel.findById(loggedInUserId);
        const user = await userModel.findById(userId);

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        } else {
            return res.status(400).send({
                message: `User already followed to ${user.name}`
            })
        }
        return res.status(200).json({
            message: `${loggedInUser.name} just follow to ${user.name}`,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const unfollowController = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await userModel.findById(loggedInUserId);
        const user = await userModel.findById(userId);

        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        } else {
            return res.status(400).send({
                message: `User not follow yet`
            })
        }
        return res.status(200).json({
            message: `${loggedInUser.name} just unfollow to ${user.name}`,
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while get others users"
        })
    }
}


//--------------------Profile Image Update----------------------------------------------

// export const updateProfile = async (req, res) => {
//     try {
        
//         let { profileImg, coverImg } = req.body;
//         const userId = req.params.id;
//         let user = await userModel.findById(userId)
//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (profileImg) {
//             if (user.profileImg) {
//                 await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
//             }

//             const uploadedResponse = await cloudinary.uploader.upload(profileImg);
//             profileImg = uploadedResponse.secure_url;
//         }

//         if (coverImg) {
//             if (user.coverImg) {
//                 await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
//             }
//         }

//         const uploadedResponse = await cloudinary.uploader.upload(coverImg);

//         coverImg = uploadedResponse.secure_url;

//         user.profileImg = profileImg || user.profileImg;
//         user.coverImg = coverImg || user.coverImg;

//         user = await user.save();

//         user.password = null;

//         return res.status(200).json(user);
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: "Error while upload image users"
//         })
//     }
// }



export const updateProfile = async (req, res) => {
    let { profileImg, coverImg } = req.body;
    const  userId  = req.params.id;
    try {
        let user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Handle profile image upload
        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            // Check if the profileImg is a valid base64 string
            if (profileImg.startsWith("data:image")) {
                const uploadedResponse = await cloudinary.uploader.upload(profileImg);
                profileImg = uploadedResponse.secure_url;
            } else {
                return res.status(400).json({ message: "Invalid profile image format" });
            }
        }

        // Handle cover image upload
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            // Check if the coverImg is a valid base64 string
            if (coverImg.startsWith("data:image")) {
                const uploadedResponse = await cloudinary.uploader.upload(coverImg);
                coverImg = uploadedResponse.secure_url;
            } else {
                return res.status(400).json({ message: "Invalid cover image format" });
            }
        }

        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null;

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while uploading images"
        });
    }
};



export const profileImage = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await userModel.findById(id).select("-password")
        if(!user){
            return res.status(404).send({
                message:"User not found",
                success:false
            })
        }
        return res.status(200).json({
            
            profileImg:user.profileImg,
            coverImg:user.coverImg,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while uploading images"
        });
    }
}