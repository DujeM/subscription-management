/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "subscriptionId",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CustomerToSubscription" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerToSubscription_AB_unique" ON "_CustomerToSubscription"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerToSubscription_B_index" ON "_CustomerToSubscription"("B");

-- AddForeignKey
ALTER TABLE "_CustomerToSubscription" ADD CONSTRAINT "_CustomerToSubscription_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToSubscription" ADD CONSTRAINT "_CustomerToSubscription_B_fkey" FOREIGN KEY ("B") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
