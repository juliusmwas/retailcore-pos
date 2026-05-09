import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;

// 1. Create the Postgres pool
// We add production-grade settings here to handle cloud hosting better
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to sit idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection before timing out
});

// 2. Setup the adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient
export const prisma = new PrismaClient({
  adapter,
});

// 4. Enhanced Error Handling
// This helps you see exactly what goes wrong if the database disconnects
pool.on("error", (err) => {
  console.error("❌ RetailCore Database Pool Error:", err.message);
});

// A small test to log when the connection is successful (only once)
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error acquiring client", err.stack);
  }
  console.log("✅ Connected to PostgreSQL successfully!");
  release();
});
