import { PrismaClient } from "@prisma/client";

export const prisma = global.prisma || new PrismaClient();

if (process.env.NOVE !== "production") {
	global.prisma = prisma;
}
