import prisma from "../config/db";
import type { User } from "@prisma/client";

interface CreateUserData {
  email: string;
  username: string;
  password: string;
  name: string;
}

const createUser = async (data: CreateUserData): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      name: data.name,
    },
  });
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findUserByUsername = async (username: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { username },
  });
};

const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const searchUsers = async (query: string, limit: number = 10) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, username: true, name: true },
    take: limit,
  });
};

export { createUser, findUserByEmail, findUserByUsername, findUserById, searchUsers };
