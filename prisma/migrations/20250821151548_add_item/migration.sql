-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('技術裝備', '炊事裝備', '營帳裝備', '服裝類', '個人裝備類', '其他');

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "type" "public"."ItemType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PersonalItemList" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalItemList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamItemList" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamItemList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PersonalItemList" ADD CONSTRAINT "PersonalItemList_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."plan_team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamItemList" ADD CONSTRAINT "TeamItemList_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."plan_team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
