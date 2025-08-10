/*
  Warnings:

  - You are about to drop the column `belongProfileId` on the `plan_team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."plan_team" DROP CONSTRAINT "plan_team_belongProfileId_fkey";

-- AlterTable
ALTER TABLE "public"."plan_team" DROP COLUMN "belongProfileId";

-- AlterTable
ALTER TABLE "public"."plan_team_meta" ADD COLUMN     "belongProfileId" UUID;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_belongProfileId_fkey" FOREIGN KEY ("belongProfileId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
