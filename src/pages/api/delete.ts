import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middlewares/AuthMiddleWare";

const prisma = new PrismaClient();

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;

  if (user.role === "User") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  if (req.method === "POST") {
    const { userId } = req.body;
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: parseInt(userId),
        },
      });

      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Error deleting user" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(deleteUser);
