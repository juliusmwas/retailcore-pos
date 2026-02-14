/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "country" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");
