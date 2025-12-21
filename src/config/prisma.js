// src/config/prisma.js
import pkg from "@prisma/client";
import { DATABASE_URL } from "./env.js";

const { PrismaClient } = pkg;

// Assure la variable d'env pour Prisma
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = DATABASE_URL;
}

// Singleton (évite plusieurs connexions en dev avec watch/reload)
const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.__prisma ??
    new PrismaClient({
        log: ["error", "warn"], // optionnel : utile en dev
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma;
}
