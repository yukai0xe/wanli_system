/*
  Warnings:

  - Changed the type of `type` on the `plan_team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."plan_team" DROP COLUMN "type",
ADD COLUMN     "type" JSONB NOT NULL;
