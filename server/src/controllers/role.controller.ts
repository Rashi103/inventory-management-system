import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        employees: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);

    res.status(500).json({
      message: "Failed to fetch roles",
    });
  }
};

export default {
  getRoles,
};