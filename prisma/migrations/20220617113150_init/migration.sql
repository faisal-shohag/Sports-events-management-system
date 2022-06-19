/*
  Warnings:

  - You are about to drop the column `adminId` on the `AdminNotifications` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `TeacherNotifications` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AdminNotifications` DROP FOREIGN KEY `AdminNotifications_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherNotifications` DROP FOREIGN KEY `TeacherNotifications_teacherId_fkey`;

-- AlterTable
ALTER TABLE `AdminNotifications` DROP COLUMN `adminId`;

-- AlterTable
ALTER TABLE `Games` ADD COLUMN `studentId` INTEGER NOT NULL,
    ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TeacherNotifications` DROP COLUMN `teacherId`;

-- AddForeignKey
ALTER TABLE `Games` ADD CONSTRAINT `Games_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Games` ADD CONSTRAINT `Games_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
