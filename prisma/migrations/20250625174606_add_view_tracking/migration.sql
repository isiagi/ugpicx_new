-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "image_views" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_views_imageId_idx" ON "image_views"("imageId");

-- CreateIndex
CREATE INDEX "image_views_ipAddress_idx" ON "image_views"("ipAddress");

-- CreateIndex
CREATE INDEX "image_views_createdAt_idx" ON "image_views"("createdAt");

-- AddForeignKey
ALTER TABLE "image_views" ADD CONSTRAINT "image_views_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
