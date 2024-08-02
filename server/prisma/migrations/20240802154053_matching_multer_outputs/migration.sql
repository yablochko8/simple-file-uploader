/*
  Warnings:

  - You are about to drop the column `name` on the `fileinstorage` table. All the data in the column will be lost.
  - Added the required column `bucket` to the `fileinstorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `fileinstorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `fileinstorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalname` to the `fileinstorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `fileinstorage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fileinstorage" DROP COLUMN "name",
ADD COLUMN     "bucket" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalname" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
