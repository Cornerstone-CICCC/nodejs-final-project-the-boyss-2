import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getFollowers, getFollowing } from "../models/follow.model";
import { searchUsers, findUserByUsername, getAllUsers } from "../models/user.model";

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

const searchUsersHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim().length === 0) {
      res.json({ users: [] });
      return;
    }
    const limit = Number(req.query.limit) || 10;
    const users = await searchUsers(query.trim(), limit);
    res.json({ users });
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserByUsername = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await findUserByUsername(req.params.username as string);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user: { id: user.id, username: user.username, name: user.name } });
  } catch (error) {
    console.error("getUserByUsername error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listAllUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const users = await getAllUsers(limit);
    res.json({ users });
  } catch (error) {
    console.error("listAllUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getUserFollowers, getUserFollowing, searchUsersHandler, getUserByUsername, listAllUsers };
