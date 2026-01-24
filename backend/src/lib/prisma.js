import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // ← important!

const { PrismaClient } = pkg;

// Create Postgres pool with the correct URL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma adapter for Postgres
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with adapter
export const prisma = new PrismaClient({ adapter });
