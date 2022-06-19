/*
  Warnings:

  - You are about to drop the column `userId` on the `PhotoUrls` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `PhotoUrls` DROP FOREIGN KEY `PhotoUrls_userId_fkey`;

-- AlterTable
ALTER TABLE `PhotoUrls` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL;
