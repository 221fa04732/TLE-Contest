/*
  Warnings:

  - A unique constraint covering the columns `[contestId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_contestId_key" ON "Video"("contestId");
