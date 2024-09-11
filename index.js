import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";
import path from 'path';


const app = express();
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

connectDB();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.static('public'))


app.use('/api/user', userRoute)
app.use('/api/tweet', tweetRoute)
app.use('/api/notification', notificationRoute)

app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/dist/index.html"))
})


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})