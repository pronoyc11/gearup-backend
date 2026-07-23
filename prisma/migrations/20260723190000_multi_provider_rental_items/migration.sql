-- Add aggregate statuses used when one order contains items from multiple providers.
ALTER TYPE "RentalStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_CONFIRMED';
ALTER TYPE "RentalStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_PICKED_UP';
ALTER TYPE "RentalStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_RETURNED';

-- Store the payment gateway used for the order-level payment.
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE';

-- Move provider-owned rental data into line items.
CREATE TABLE "rentalOrderItems" (
    "id" TEXT NOT NULL,
    "rentalOrderId" TEXT NOT NULL,
    "gearId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerDay" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'PLACED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rentalOrderItems_pkey" PRIMARY KEY ("id")
);

INSERT INTO "rentalOrderItems" (
    "id",
    "rentalOrderId",
    "gearId",
    "providerId",
    "quantity",
    "pricePerDay",
    "subtotal",
    "status",
    "createdAt",
    "updatedAt"
)
SELECT
    md5(ro."id" || ro."gearId" || ro."createdAt"::text),
    ro."id",
    ro."gearId",
    g."providerId",
    ro."quantity"::integer,
    g."pricePerDay",
    ro."totalAmount",
    ro."status",
    ro."createdAt",
    ro."updatedAt"
FROM "rentalOrders" ro
JOIN "gears" g ON g."id" = ro."gearId"
WHERE ro."gearId" IS NOT NULL;

CREATE INDEX "rentalOrderItems_rentalOrderId_idx" ON "rentalOrderItems"("rentalOrderId");
CREATE INDEX "rentalOrderItems_gearId_idx" ON "rentalOrderItems"("gearId");
CREATE INDEX "rentalOrderItems_providerId_idx" ON "rentalOrderItems"("providerId");

ALTER TABLE "rentalOrderItems" ADD CONSTRAINT "rentalOrderItems_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rentalOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rentalOrderItems" ADD CONSTRAINT "rentalOrderItems_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "gears"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rentalOrderItems" ADD CONSTRAINT "rentalOrderItems_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reviews now belong to a returned rental item rather than the whole order.
ALTER TABLE "reviews" ADD COLUMN "rentalOrderItemId" TEXT;

UPDATE "reviews" r
SET "rentalOrderItemId" = roi."id"
FROM "rentalOrderItems" roi
WHERE roi."rentalOrderId" = r."rentalOrderId"
  AND roi."gearId" = r."gearId";

ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_rentalOrderId_fkey";
DROP INDEX IF EXISTS "reviews_rentalOrderId_key";
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "rentalOrderId";
ALTER TABLE "reviews" ALTER COLUMN "rentalOrderItemId" SET NOT NULL;
CREATE UNIQUE INDEX "reviews_rentalOrderItemId_key" ON "reviews"("rentalOrderItemId");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rentalOrderItemId_fkey" FOREIGN KEY ("rentalOrderItemId") REFERENCES "rentalOrderItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove the old single-item columns from rental orders.
ALTER TABLE "rentalOrders" DROP CONSTRAINT IF EXISTS "rentalOrders_gearId_fkey";
DROP INDEX IF EXISTS "rentalOrders_gearId_idx";
ALTER TABLE "rentalOrders" DROP COLUMN IF EXISTS "gearId";
ALTER TABLE "rentalOrders" DROP COLUMN IF EXISTS "quantity";
