-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "storagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "personId" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_person_shared" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_person_shared_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_name_key" ON "person"("name");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_person_shared" ADD CONSTRAINT "file_person_shared_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_person_shared" ADD CONSTRAINT "file_person_shared_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
