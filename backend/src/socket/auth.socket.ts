import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model";

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
  });
  return cookies;
}

export const socketAuthMiddleware = (io: SocketIOServer) => {
  io.use(async (socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("Authentication error: no cookies"));
      }

      const cookies = parseCookies(cookieHeader);
      const token = cookies.token;
      if (!token) {
        return next(new Error("Authentication error: no token"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const user = await findUserById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });
};
