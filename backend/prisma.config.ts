import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  datasource: {
    // Prisma 7 looks for the connection string here for migrations
    url: process.env.DATABASE_URL 
  }
});