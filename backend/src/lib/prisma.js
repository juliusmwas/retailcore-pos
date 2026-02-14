import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;

// 1. Create the Postgres pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Setup the adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient
// We add 'datasource' here to ensure the client knows the URL context 
// even while using the adapter.
export const prisma = new PrismaClient({ 
  adapter,
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Optional: Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});