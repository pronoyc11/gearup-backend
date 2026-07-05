/*
  Warnings:

  - You are about to drop the column `availabililty` on the `gears` table. All the data in the column will be lost.
  - You are about to alter the column `pricePerDay` on the `gears` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `updateAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "gears_providerId_categoryId_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "gears" DROP COLUMN "availabililty",
ADD COLUMN     "availability" "GearAvailability" NOT NULL DEFAULT 'AVAILABLE',
ALTER COLUMN "pricePerDay" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "gears_providerId_idx" ON "gears"("providerId");

-- CreateIndex
CREATE INDEX "gears_categoryId_idx" ON "gears"("categoryId");
