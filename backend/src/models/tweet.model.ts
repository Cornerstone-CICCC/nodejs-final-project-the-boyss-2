import prisma from "../config/db";

const tweetInclude = {
  author: { select: { id: true, username: true, name: true } },
  _count: { select: { likes: true, retweets: true, replies: true } },
};

const createTweet = async (data: {
  content: string;
  authorId: number;
  parentId?: number;
}) => {
  return prisma.tweet.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      parentId: data.parentId ?? null,
    },
    include: tweetInclude,
  });
};

const findTweetById = async (id: number) => {
  return prisma.tweet.findUnique({
    where: { id },
    include: tweetInclude,
  });
};

const updateTweet = async (id: number, content: string) => {
  return prisma.tweet.update({
    where: { id },
    data: { content },
    include: tweetInclude,
  });
};

const deleteTweet = async (id: number) => {
  return prisma.tweet.delete({ where: { id } });
};

const findRepliesByTweetId = async (tweetId: number) => {
  return prisma.tweet.findMany({
    where: { parentId: tweetId },
    include: tweetInclude,
    orderBy: { createdAt: "asc" },
  });
};

const findTweetsByUserId = async (userId: number) => {
  return prisma.tweet.findMany({
    where: { authorId: userId, parentId: null },
    include: tweetInclude,
    orderBy: { createdAt: "desc" },
  });
};

const findUserTweetsAndRetweets = async (userId: number) => {
  const [tweets, retweets] = await Promise.all([
    prisma.tweet.findMany({
      where: { authorId: userId, parentId: null },
      include: tweetInclude,
      orderBy: { createdAt: "desc" },
    }),
    prisma.retweet.findMany({
      where: { userId },
      include: {
        tweet: { include: tweetInclude },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const authored = tweets.map((t) => ({
    type: "tweet" as const,
    sortDate: t.createdAt,
    tweet: t,
  }));

  const retweeted = retweets.map((r) => ({
    type: "retweet" as const,
    sortDate: r.createdAt,
    tweet: r.tweet,
    retweetedAt: r.createdAt,
  }));

  return [...authored, ...retweeted].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
  );
};

const findTopLikedTweetsByUserId = async (
  userId: number,
  limit: number = 10
) => {
  return prisma.tweet.findMany({
    where: { authorId: userId },
    include: tweetInclude,
    orderBy: { likes: { _count: "desc" } },
    take: limit,
  });
};

const toggleLike = async (
  userId: number,
  tweetId: number
): Promise<{ liked: boolean }> => {
  const existing = await prisma.like.findUnique({
    where: { userId_tweetId: { userId, tweetId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  } else {
    await prisma.like.create({ data: { userId, tweetId } });
    return { liked: true };
  }
};

const toggleRetweet = async (
  userId: number,
  tweetId: number
): Promise<{ retweeted: boolean }> => {
  const existing = await prisma.retweet.findUnique({
    where: { userId_tweetId: { userId, tweetId } },
  });

  if (existing) {
    await prisma.retweet.delete({ where: { id: existing.id } });
    return { retweeted: false };
  } else {
    await prisma.retweet.create({ data: { userId, tweetId } });
    return { retweeted: true };
  }
};

const getLikeCount = async (tweetId: number): Promise<number> => {
  return prisma.like.count({ where: { tweetId } });
};

const getRetweetCount = async (tweetId: number): Promise<number> => {
  return prisma.retweet.count({ where: { tweetId } });
};

export {
  createTweet,
  findTweetById,
  updateTweet,
  deleteTweet,
  findRepliesByTweetId,
  findTweetsByUserId,
  findUserTweetsAndRetweets,
  findTopLikedTweetsByUserId,
  toggleLike,
  toggleRetweet,
  getLikeCount,
  getRetweetCount,
};
