-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_colorId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "product_colors_id_productId_key" ON "product_colors"("id", "productId");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_colorId_productId_fkey" FOREIGN KEY ("colorId", "productId") REFERENCES "product_colors"("id", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

