import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middlewares/AuthMiddleWare";
import { Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const user = (req as any).user;

    const { page, usersRole, usersStatus, query } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = 10;

    try {
      const isAdmin = user?.role === "Admin";

      const users = await prisma.user.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        where: {
          ...(!isAdmin ? { role: "User" } : {}),
          ...(usersRole === "" ? {} : { role: usersRole as Role }),
          ...(usersStatus === "" ? {} : { status: usersStatus as Status }),
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        orderBy: [
          {
            role: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

      const totalUsers = await prisma.user.count({
        where: {
          ...(!isAdmin ? { role: "User" } : {}),
          ...(usersRole === "" ? {} : { role: usersRole as Role }),
          ...(usersStatus === "" ? {} : { status: usersStatus as Status }),
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
      });

      res.status(200).json({
        data: users,
        meta: {
          totalUsers,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(getUsers);
