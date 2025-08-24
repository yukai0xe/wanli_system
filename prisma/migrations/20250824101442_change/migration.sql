/*
  Warnings:

  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_guideId_fkey";

-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_leaderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_staybehindId_fkey";

-- AlterTable
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Member_id_seq";

-- AlterTable
ALTER TABLE "public"."plan_team_meta" ALTER COLUMN "leaderId" SET DATA TYPE TEXT,
ALTER COLUMN "guideId" SET DATA TYPE TEXT,
ALTER COLUMN "staybehindId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_staybehindId_fkey" FOREIGN KEY ("staybehindId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
