


import express from 'express'
import { addCommentController, createTweetController, deleteCommentsController, deleteTweetController, getAllTweets, getCommentsController, getFollowingTweets, likeOrDislike, UserTweetController } from '../controller/tweetController.js';
import isAuthenticated from '../config/auth.js';

const router = express.Router();


// http://localhost:8080/api/tweet/createTweet
router.post('/createTweet', isAuthenticated, createTweetController);


// http://localhost:8080/api/tweet/deleteTweet
router.delete('/deleteTweet/:id', isAuthenticated, deleteTweetController);


// http://localhost:8080/api/tweet/likeOrDislike/:id
router.put('/likeOrDislike/:id', isAuthenticated, likeOrDislike);

// http://localhost:8080/api/tweet/tweets/:tweetId/comments
router.post('/tweets/:tweetId/comments', addCommentController);

//get
// http://localhost:8080/api/tweet/tweets/:tweetId/comments
router.get('/tweets/:tweetId/comments', getCommentsController);

//delete own comment 
// http://localhost:8080/api/tweet/tweets/:tweetId/comments
router.delete('/tweets/:tweetId/comments/:commentId', deleteCommentsController);



router.get('/alltweets/:id', isAuthenticated, getAllTweets);

router.get('/followingtweets/:id', isAuthenticated, getFollowingTweets);

router.get('/mytweet/:id', UserTweetController);

export default router;  