import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers["auth-token"];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(
        token as string,
        process.env.NEXT_PUBLIC_JWT_SECRET!
      ) as unknown as { email: string };

      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      (req as any).user = user;

      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Token verification failed" });
    }
  };
};

export default authMiddleware;
