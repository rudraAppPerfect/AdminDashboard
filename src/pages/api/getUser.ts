import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middlewares/AuthMiddleWare";

const prisma = new PrismaClient();

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  res.status(200).json(user);
}

export default authMiddleware(getUser);
