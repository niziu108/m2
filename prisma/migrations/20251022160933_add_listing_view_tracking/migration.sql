-- CreateEnum
CREATE TYPE "ViewSource" AS ENUM ('INTERNAL', 'EXTERNAL', 'UNKNOWN');

-- CreateTable
CREATE TABLE "ListingView" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "source" "ViewSource" NOT NULL,
    "referrer" TEXT,
    "ua" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingView_listingId_createdAt_idx" ON "ListingView"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingView_listingId_source_idx" ON "ListingView"("listingId", "source");

-- CreateIndex
CREATE INDEX "ListingView_ipHash_listingId_createdAt_idx" ON "ListingView"("ipHash", "listingId", "createdAt");
