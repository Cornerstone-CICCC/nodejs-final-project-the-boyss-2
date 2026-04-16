import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getTweet,
  getTweetReplies,
  getUserTweets,
  getUserFeed,
  getUserTopTweets,
} from "../controllers/tweet.controller";

const tweetRouter = Router();

// /user/... routes before /:id to avoid param conflicts
tweetRouter.get("/user/:userId", protect, getUserTweets);
tweetRouter.get("/user/:userId/feed", protect, getUserFeed);
tweetRouter.get("/user/:userId/top", protect, getUserTopTweets);
tweetRouter.get("/:id", protect, getTweet);
tweetRouter.get("/:id/replies", protect, getTweetReplies);

export default tweetRouter;
