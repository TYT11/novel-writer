/*
  Warnings:

  - Added the required column `content` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA NOT NULL;
