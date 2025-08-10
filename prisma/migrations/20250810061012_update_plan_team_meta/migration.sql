/*
  Warnings:

  - You are about to drop the column `perpareDate` on the `plan_team` table. All the data in the column will be lost.
  - Added the required column `prepareDate` to the `plan_team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EventState" AS ENUM ('仍未開始', '處理中', '完成囉', '輸出檔案了');

-- AlterEnum
ALTER TYPE "public"."TeamRole" ADD VALUE '一般隊員';

-- AlterTable
ALTER TABLE "public"."plan_team" DROP COLUMN "perpareDate",
ADD COLUMN     "prepareDate" INTEGER NOT NULL;
