import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;

// 1. Create the Postgres pool (The connection lives here)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Setup the adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient (Just pass the adapter)
// We remove the 'datasource' block entirely to satisfy Prisma 7
export const prisma = new PrismaClient({ 
  adapter 
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});