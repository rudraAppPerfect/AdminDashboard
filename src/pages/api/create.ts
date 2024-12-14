import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcryptjs";
import authMiddleware from "@/middlewares/AuthMiddleWare";

const prisma = new PrismaClient();

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;

  if (user.role === "User") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  if (req.method === "POST") {
    const { name, email, role, status, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = (await bcrypt.hash(password, salt)) as string;

    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        return res
          .status(401)
          .json({ message: "User with this email already exists." });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
          status: status as Status,
          password: hashedPassword,
        },
      });
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error adding user" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(createUser);
