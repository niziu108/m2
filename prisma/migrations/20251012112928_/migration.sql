/*
  Warnings:

  - You are about to drop the column `order` on the `Listing` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Listing_order_createdAt_idx";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "order",
ADD COLUMN     "sortIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Listing_sortIndex_createdAt_idx" ON "Listing"("sortIndex", "createdAt");
