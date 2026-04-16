import prisma from "../config/db";

const toggleFollow = async (
  followerId: number,
  followingId: number
): Promise<{ followed: boolean }> => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { followed: false };
  } else {
    await prisma.follow.create({ data: { followerId, followingId } });
    return { followed: true };
  }
};

const getFollowers = async (userId: number) => {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: { select: { id: true, username: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getFollowing = async (userId: number) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: { select: { id: true, username: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const isFollowing = async (
  followerId: number,
  followingId: number
): Promise<boolean> => {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return !!follow;
};

export { toggleFollow, getFollowers, getFollowing, isFollowing };
