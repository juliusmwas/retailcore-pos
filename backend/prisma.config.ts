import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // 1. Tell Prisma where your schema is
  schema: "./prisma/schema.prisma",

  // 2. Configure the datasource for the CLI (Migrations, Introspection)
  datasource: {
    url: env("DATABASE_URL"),
  },

  // 3. (Optional) Helpful if you want to name your migrations folder
  migrations: {
    path: "prisma/migrations",
  },
});
