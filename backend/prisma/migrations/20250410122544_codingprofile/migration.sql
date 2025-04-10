-- CreateTable
CREATE TABLE "CodingProfile" (
    "id" TEXT NOT NULL,
    "codechef" TEXT NOT NULL,
    "leetcode" TEXT NOT NULL,
    "codeforces" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CodingProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodingProfile" ADD CONSTRAINT "CodingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
