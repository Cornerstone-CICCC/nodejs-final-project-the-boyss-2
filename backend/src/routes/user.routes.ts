import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getMe } from "../controllers/auth.controller";
import { getUserFollowers, getUserFollowing, searchUsersHandler,} from "../controllers/follow.controller";

const userRouter = Router();

userRouter.get("/me", protect, getMe);
userRouter.get("/search", protect, searchUsersHandler);
userRouter.get("/:userId/followers", protect, getUserFollowers);
userRouter.get("/:userId/following", protect, getUserFollowing);

export default userRouter;