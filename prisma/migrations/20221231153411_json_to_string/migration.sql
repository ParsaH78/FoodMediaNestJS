-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "members" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "likes" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "followers" SET DATA TYPE TEXT[],
ALTER COLUMN "followings" SET DATA TYPE TEXT[];
