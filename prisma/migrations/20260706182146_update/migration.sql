/*
  Warnings:

  - Changed the type of `specifications` on the `gears` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "gears" DROP COLUMN "specifications",
ADD COLUMN     "specifications" JSONB NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
