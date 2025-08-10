-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('Leader', 'Guide', 'StayBehind', 'ClubExec');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."DateType" AS ENUM ('OneDay', 'MoreDay');

-- CreateEnum
CREATE TYPE "public"."TeamCategory" AS ENUM ('General', 'Technical');

-- CreateEnum
CREATE TYPE "public"."TeamActivityType" AS ENUM ('Official', 'Private', 'Exploration');

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."TeamRole" NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "birth" TIMESTAMP(3),
    "IDNumber" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "department" TEXT,
    "studentNumber" TEXT,
    "planTeamId" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plan_team" (
    "id" SERIAL NOT NULL,
    "mainName" TEXT NOT NULL,
    "mainDescription" TEXT NOT NULL,
    "type" "public"."TeamCategory" NOT NULL,
    "dateType" "public"."DateType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "perpareDate" INTEGER NOT NULL,
    "expectedTeamSize" INTEGER,
    "transportType" TEXT[],

    CONSTRAINT "plan_team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_planTeamId_fkey" FOREIGN KEY ("planTeamId") REFERENCES "public"."plan_team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
