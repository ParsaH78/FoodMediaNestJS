/*
  Warnings:

  - Changed the type of `comments` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ingredients` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rating` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "comments",
ADD COLUMN     "comments" JSONB NOT NULL,
DROP COLUMN "ingredients",
ADD COLUMN     "ingredients" JSONB NOT NULL,
DROP COLUMN "rating",
ADD COLUMN     "rating" JSONB NOT NULL;
