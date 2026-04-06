-- CreateTable
CREATE TABLE "RestockRequest" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestockRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestockRequest" ADD CONSTRAINT "RestockRequest_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "ProductInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
