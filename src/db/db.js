import { PrismaClient } from "@prisma/client";

// * se crea una variable global para la coneccion de la db y se exporta
export const prisma = global.prisma || new PrismaClient();

if (process.env.NOVE !== "production") {
	global.prisma = prisma;
}
