/*
  Warnings:

  - You are about to drop the column `bookId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_bookId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "bookId";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
