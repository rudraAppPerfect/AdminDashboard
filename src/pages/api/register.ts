import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = (await bcrypt.hash(password, salt)) as string;
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role: "User",
          status: "Inactive",
          password: hashedPassword,
          isAdmin: false,
        },
      });

      const token = jwt.sign(
        { email: newUser.email, isAdmin: newUser.isAdmin },
        process.env.NEXT_PUBLIC_JWT_SECRET as string
      );

      return res
        .status(200)
        .json({ message: "Registration successful", token });
    } catch (error) {
      res.status(500).json({ error: "Error adding user" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
