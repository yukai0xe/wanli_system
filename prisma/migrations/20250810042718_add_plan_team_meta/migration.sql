-- AlterTable
ALTER TABLE "public"."plan_team" ADD COLUMN     "belongProfileId" UUID;

-- CreateTable
CREATE TABLE "public"."plan_team_meta" (
    "id" SERIAL NOT NULL,
    "planTeamId" INTEGER NOT NULL,
    "mainName" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "prepareDate" INTEGER NOT NULL,
    "leaderId" INTEGER NOT NULL,
    "guideId" INTEGER NOT NULL,
    "staybehindId" INTEGER NOT NULL,
    "stats" JSONB NOT NULL,
    "teamSize" INTEGER NOT NULL,
    "eventState" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_team_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_team_meta_planTeamId_key" ON "public"."plan_team_meta"("planTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_team_meta_leaderId_key" ON "public"."plan_team_meta"("leaderId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_team_meta_guideId_key" ON "public"."plan_team_meta"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_team_meta_staybehindId_key" ON "public"."plan_team_meta"("staybehindId");

-- AddForeignKey
ALTER TABLE "public"."plan_team" ADD CONSTRAINT "plan_team_belongProfileId_fkey" FOREIGN KEY ("belongProfileId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_planTeamId_fkey" FOREIGN KEY ("planTeamId") REFERENCES "public"."plan_team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_team_meta" ADD CONSTRAINT "plan_team_meta_staybehindId_fkey" FOREIGN KEY ("staybehindId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
