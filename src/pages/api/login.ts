import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function UserLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (user.status === "Inactive") {
        return res
          .status(401)
          .json({ message: "User is Inactive. Please contact Admin." });
      }

      const token = jwt.sign(
        { email: user.email },
        `${process.env.NEXT_PUBLIC_JWT_SECRET}`
      );

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ message: "Error logging in user" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
