/*
  Warnings:

  - You are about to drop the column `studentId` on the `Games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Games` DROP FOREIGN KEY `Games_studentId_fkey`;

-- AlterTable
ALTER TABLE `AdminNotifications` ADD COLUMN `seen` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `Games` DROP COLUMN `studentId`,
    ADD COLUMN `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `TeacherNotifications` ADD COLUMN `seen` BOOLEAN NULL;

-- CreateTable
CREATE TABLE `GameStudents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    INDEX `gameId`(`gameId`),
    INDEX `studentId`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameStudents` ADD CONSTRAINT `GameStudents_ibfk_1` FOREIGN KEY (`gameId`) REFERENCES `Games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameStudents` ADD CONSTRAINT `GameStudents_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
