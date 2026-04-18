import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getUserFollowers,
  getUserFollowing,
  searchUsersHandler,
  getUserByUsername,
  listAllUsers,
} from "../controllers/follow.controller";

const userRouter = Router();

userRouter.get("/all", protect, listAllUsers);
userRouter.get("/search", protect, searchUsersHandler);
userRouter.get("/profile/:username", protect, getUserByUsername);
userRouter.get("/:userId/followers", protect, getUserFollowers);
userRouter.get("/:userId/following", protect, getUserFollowing);

export default userRouter;
