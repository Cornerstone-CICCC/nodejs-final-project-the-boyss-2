import { Server as SocketIOServer, Socket } from "socket.io";
import { socketAuthMiddleware } from "./auth.socket";
import {
  createTweet,
  findTweetById,
  findRepliesByTweetId,
  updateTweet,
  deleteTweet,
  toggleLike,
  toggleRetweet,
  getLikeCount,
  getRetweetCount,
} from "../models/tweet.model";
import { toggleFollow } from "../models/follow.model";

export const setupSocketHandlers = (io: SocketIOServer) => {
  socketAuthMiddleware(io);

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.username} (socket: ${socket.id})`);

    // ─── tweet:create ───
    socket.on(
      "tweet:create",
      async (
        data: { content: string; parentId?: number },
        callback?: (response: any) => void
      ) => {
        try {
          if (!data.content || data.content.trim().length === 0) {
            callback?.({ error: "Content is required" });
            return;
          }

          if (data.parentId) {
            const parent = await findTweetById(data.parentId);
            if (!parent) {
              callback?.({ error: "Parent tweet not found" });
              return;
            }
          }

          const tweet = await createTweet({
            content: data.content,
            authorId: user.id,
            parentId: data.parentId,
          });

          io.emit("tweet:created", { tweet });
          callback?.({ tweet });
        } catch (error) {
          console.error("tweet:create error:", error);
          callback?.({ error: "Failed to create tweet" });
        }
      }
    );

    // ─── tweet:update ───
    socket.on(
      "tweet:update",
      async (
        data: { tweetId: number; content: string },
        callback?: (response: any) => void
      ) => {
        try {
          const existing = await findTweetById(data.tweetId);
          if (!existing) {
            callback?.({ error: "Tweet not found" });
            return;
          }
          if (existing.authorId !== user.id) {
            callback?.({ error: "Not authorized to update this tweet" });
            return;
          }
          if (!data.content || data.content.trim().length === 0) {
            callback?.({ error: "Content is required" });
            return;
          }

          const tweet = await updateTweet(data.tweetId, data.content);
          io.emit("tweet:updated", { tweet });
          callback?.({ tweet });
        } catch (error) {
          console.error("tweet:update error:", error);
          callback?.({ error: "Failed to update tweet" });
        }
      }
    );

    // ─── tweet:delete ───
    socket.on(
      "tweet:delete",
      async (
        data: { tweetId: number },
        callback?: (response: any) => void
      ) => {
        try {
          const existing = await findTweetById(data.tweetId);
          if (!existing) {
            callback?.({ error: "Tweet not found" });
            return;
          }
          if (existing.authorId !== user.id) {
            callback?.({ error: "Not authorized to delete this tweet" });
            return;
          }

          await deleteTweet(data.tweetId);
          io.emit("tweet:deleted", { tweetId: data.tweetId });
          callback?.({ success: true });
        } catch (error) {
          console.error("tweet:delete error:", error);
          callback?.({ error: "Failed to delete tweet" });
        }
      }
    );

    // ─── tweet:like ───
    socket.on(
      "tweet:like",
      async (
        data: { tweetId: number },
        callback?: (response: any) => void
      ) => {
        try {
          const tweet = await findTweetById(data.tweetId);
          if (!tweet) {
            callback?.({ error: "Tweet not found" });
            return;
          }

          const result = await toggleLike(user.id, data.tweetId);
          const likeCount = await getLikeCount(data.tweetId);

          io.emit("tweet:liked", {
            tweetId: data.tweetId,
            userId: user.id,
            liked: result.liked,
            likeCount,
          });
          callback?.({ ...result, likeCount });
        } catch (error) {
          console.error("tweet:like error:", error);
          callback?.({ error: "Failed to toggle like" });
        }
      }
    );

    // ─── tweet:retweet ───
    socket.on(
      "tweet:retweet",
      async (
        data: { tweetId: number },
        callback?: (response: any) => void
      ) => {
        try {
          const tweet = await findTweetById(data.tweetId);
          if (!tweet) {
            callback?.({ error: "Tweet not found" });
            return;
          }

          const result = await toggleRetweet(user.id, data.tweetId);
          const retweetCount = await getRetweetCount(data.tweetId);

          io.emit("tweet:retweeted", {
            tweetId: data.tweetId,
            userId: user.id,
            retweeted: result.retweeted,
            retweetCount,
            tweet,
            retweetedBy: { id: user.id, username: user.username, name: user.name },
          });
          callback?.({ ...result, retweetCount });
        } catch (error) {
          console.error("tweet:retweet error:", error);
          callback?.({ error: "Failed to toggle retweet" });
        }
      }
    );

    // ─── tweet:getReplies ───
    socket.on(
      "tweet:getReplies",
      async (
        data: { tweetId: number },
        callback?: (response: any) => void
      ) => {
        try {
          const replies = await findRepliesByTweetId(data.tweetId);
          callback?.({ replies });
        } catch (error) {
          console.error("tweet:getReplies error:", error);
          callback?.({ error: "Failed to get replies" });
        }
      }
    );

    // ─── user:follow ───
    socket.on(
      "user:follow",
      async (
        data: { userId: number },
        callback?: (response: any) => void
      ) => {
        try {
          const result = await toggleFollow(user.id, data.userId);

          io.emit("user:followed", {
            followerId: user.id,
            followingId: data.userId,
            followed: result.followed,
          });
          callback?.(result);
        } catch (error: any) {
          console.error("user:follow error:", error);
          callback?.({ error: error.message || "Failed to toggle follow" });
        }
      }
    );

    // ─── disconnect ───
    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${user.username} (socket: ${socket.id})`
      );
    });
  });
};
