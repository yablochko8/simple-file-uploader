/*
  Warnings:

  - You are about to drop the column `name` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "person_name_key";

-- AlterTable
ALTER TABLE "person" DROP COLUMN "name",
DROP COLUMN "nickname",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "person_clerkId_key" ON "person"("clerkId");
