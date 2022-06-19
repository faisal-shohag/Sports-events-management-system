/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Events` DROP FOREIGN KEY `Events_teacherId_fkey`;

-- AlterTable
ALTER TABLE `Events` DROP COLUMN `teacherId`;
