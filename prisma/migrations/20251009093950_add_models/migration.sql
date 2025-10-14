-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DOM', 'MIESZKANIE', 'DZIALKA', 'INNE');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "price" INTEGER NOT NULL,
    "area" DOUBLE PRECISION,
    "location" TEXT,
    "listingNumber" TEXT NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "bullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImageUrl" TEXT,
    "virtualTourUrl" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "shortDesc" TEXT,
    "body" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_listingNumber_key" ON "Listing"("listingNumber");

-- CreateIndex
CREATE INDEX "Listing_category_idx" ON "Listing"("category");

-- CreateIndex
CREATE INDEX "Listing_listingNumber_idx" ON "Listing"("listingNumber");

-- CreateIndex
CREATE INDEX "Listing_price_idx" ON "Listing"("price");

-- CreateIndex
CREATE INDEX "Listing_area_idx" ON "Listing"("area");

-- CreateIndex
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");

-- CreateIndex
CREATE INDEX "Listing_isReserved_createdAt_idx" ON "Listing"("isReserved", "createdAt");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
