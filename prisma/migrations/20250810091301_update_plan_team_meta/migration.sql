/*
  Warnings:

  - Added the required column `startDate` to the `plan_team_meta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."plan_team_meta" ADD COLUMN     "startDate" TEXT NOT NULL;
