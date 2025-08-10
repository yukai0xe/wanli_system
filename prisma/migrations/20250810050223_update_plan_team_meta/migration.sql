-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_guideId_fkey";

-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_leaderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."plan_team_meta" DROP CONSTRAINT "plan_team_meta_staybehindId_fkey";

-- AlterTable
ALTER TABLE "public"."plan_team_meta" ALTER COLUMN "leaderId" DROP NOT NULL,
ALTER COLUMN "guideId" DROP NOT NULL,
ALTER COLUMN "staybehindId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_staybehindId_fkey" FOREIGN KEY ("staybehindId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
