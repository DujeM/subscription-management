/*
  Warnings:

  - You are about to drop the column `priceId` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `priceIds` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "priceId",
ADD COLUMN     "priceIds" TEXT NOT NULL;
