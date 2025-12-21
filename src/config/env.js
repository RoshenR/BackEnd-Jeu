import dotenv from "dotenv";
dotenv.config({ path: process.env.ENV_FILE || ".env" });

// ✅ Variables TP
export const APP_PORT = Number(process.env.APP_PORT || 3001);

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT || 5432);
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;

// (pas demandé par le TP mais indispensable pour Postgres)
export const DB_NAME = process.env.DB_NAME || "maets";

// ✅ Prisma supporte DATABASE_URL, on la fabrique si absente
export const DATABASE_URL =
    process.env.DATABASE_URL ||
    `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// ✅ Variables existantes (on garde)
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const MONGODB_URI = process.env.MONGODB_URI;

// ✅ HTTPS optionnel
export const HTTPS = process.env.HTTPS === "true";

// Petit guard (ça évite de galérer en Docker)
if (!JWT_SECRET) throw new Error("Missing env var: JWT_SECRET");
if (!DB_HOST) throw new Error("Missing env var: DB_HOST");
if (!DB_USER) throw new Error("Missing env var: DB_USER");
if (!DB_PASSWORD) throw new Error("Missing env var: DB_PASSWORD");
if (!MONGODB_URI) throw new Error("Missing env var: MONGODB_URI");
