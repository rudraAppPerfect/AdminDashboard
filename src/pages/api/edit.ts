import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middlewares/AuthMiddleWare";

const prisma = new PrismaClient();

async function editUser(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;

  if (user.role==='User') {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  if (req.method === "POST") {
    const { userId, name, email, role, status, password} = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        return res
          .status(401)
          .json({ message: "User with this email already exists." });
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          name,
          email,
          role,
          status,
          password,
        },
      });

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(editUser);
