/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_personId_fkey";

-- DropForeignKey
ALTER TABLE "file_person_shared" DROP CONSTRAINT "file_person_shared_fileId_fkey";

-- DropTable
DROP TABLE "file";

-- CreateTable
CREATE TABLE "fileinstorage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "storagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "personId" INTEGER NOT NULL,

    CONSTRAINT "fileinstorage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fileinstorage" ADD CONSTRAINT "fileinstorage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_person_shared" ADD CONSTRAINT "file_person_shared_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "fileinstorage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
