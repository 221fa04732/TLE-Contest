/*
  Warnings:

  - You are about to drop the `CodingProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CodingProfile" DROP CONSTRAINT "CodingProfile_userId_fkey";

-- DropTable
DROP TABLE "CodingProfile";

-- CreateTable
CREATE TABLE "CodechefProfile" (
    "id" TEXT NOT NULL,
    "codechef" TEXT NOT NULL DEFAULT 'test',
    "userId" TEXT NOT NULL,

    CONSTRAINT "CodechefProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeforcesProfile" (
    "id" TEXT NOT NULL,
    "codeforces" TEXT NOT NULL DEFAULT 'test',
    "userId" TEXT NOT NULL,

    CONSTRAINT "CodeforcesProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetcodeProfile" (
    "id" TEXT NOT NULL,
    "leetcode" TEXT NOT NULL DEFAULT 'test',
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeetcodeProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodechefProfile" ADD CONSTRAINT "CodechefProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeforcesProfile" ADD CONSTRAINT "CodeforcesProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeetcodeProfile" ADD CONSTRAINT "LeetcodeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
