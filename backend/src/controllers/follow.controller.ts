import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getFollowers, getFollowing } from "../models/follow.model";

const getUserFollowers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const followers = await getFollowers(Number(req.params.userId));
    res.json({ followers });
  } catch (error) {
    console.error("getUserFollowers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserFollowing = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const following = await getFollowing(Number(req.params.userId));
    res.json({ following });
  } catch (error) {
    console.error("getUserFollowing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getUserFollowers, getUserFollowing };
