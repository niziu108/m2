-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Listing_order_createdAt_idx" ON "Listing"("order", "createdAt");
