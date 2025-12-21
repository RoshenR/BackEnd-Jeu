import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from "./env.js";

process.env.DATABASE_URL = DATABASE_URL;
export const prisma = new PrismaClient();
