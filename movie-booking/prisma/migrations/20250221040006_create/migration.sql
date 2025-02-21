/*
  Warnings:

  - You are about to drop the column `price` on the `Seat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[row,number,showtimeId]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "price";

-- CreateIndex
CREATE UNIQUE INDEX "Seat_row_number_showtimeId_key" ON "Seat"("row", "number", "showtimeId");
