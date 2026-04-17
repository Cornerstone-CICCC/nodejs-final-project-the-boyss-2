import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  findTweetById,
  findRepliesByTweetId,
  findTweetsByUserId,
  findUserTweetsAndRetweets,
  findTopLikedTweetsByUserId,
} from "../models/tweet.model";

const getTweet = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const tweet = await findTweetById(Number(req.params.id));
    if (!tweet) {
      res.status(404).json({ message: "Tweet not found" });
      return;
    }
    res.json({ tweet });
  } catch (error) {
    console.error("getTweet error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTweetReplies = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const replies = await findRepliesByTweetId(Number(req.params.id));
    res.json({ replies });
  } catch (error) {
    console.error("getTweetReplies error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserTweets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const tweets = await findTweetsByUserId(Number(req.params.userId));
    res.json({ tweets });
  } catch (error) {
    console.error("getUserTweets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserFeed = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const feed = await findUserTweetsAndRetweets(Number(req.params.userId));
    res.json({ feed });
  } catch (error) {
    console.error("getUserFeed error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserTopTweets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const tweets = await findTopLikedTweetsByUserId(
      Number(req.params.userId),
      limit
    );
    res.json({ tweets });
  } catch (error) {
    console.error("getUserTopTweets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getTweet, getTweetReplies, getUserTweets, getUserFeed, getUserTopTweets };
