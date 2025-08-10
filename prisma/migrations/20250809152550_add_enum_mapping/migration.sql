/*
  Warnings:

  - The values [OneDay,MoreDay] on the enum `DateType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Male,Female] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [Official,Private,Exploration] on the enum `TeamActivityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [General,Technical] on the enum `TeamCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [Leader,Guide,StayBehind,ClubExec] on the enum `TeamRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."DateType_new" AS ENUM ('當日來回', '過夜');
ALTER TABLE "public"."plan_team" ALTER COLUMN "dateType" TYPE "public"."DateType_new" USING ("dateType"::text::"public"."DateType_new");
ALTER TYPE "public"."DateType" RENAME TO "DateType_old";
ALTER TYPE "public"."DateType_new" RENAME TO "DateType";
DROP TYPE "public"."DateType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('男', '女');
ALTER TABLE "public"."Member" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TeamActivityType_new" AS ENUM ('正式隊伍', '私下隊伍', '探勘');
ALTER TYPE "public"."TeamActivityType" RENAME TO "TeamActivityType_old";
ALTER TYPE "public"."TeamActivityType_new" RENAME TO "TeamActivityType";
DROP TYPE "public"."TeamActivityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TeamCategory_new" AS ENUM ('一般', '技術');
ALTER TYPE "public"."TeamCategory" RENAME TO "TeamCategory_old";
ALTER TYPE "public"."TeamCategory_new" RENAME TO "TeamCategory";
DROP TYPE "public"."TeamCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TeamRole_new" AS ENUM ('領隊', '嚮導', '留守', '隨隊幹部');
ALTER TABLE "public"."Member" ALTER COLUMN "role" TYPE "public"."TeamRole_new" USING ("role"::text::"public"."TeamRole_new");
ALTER TYPE "public"."TeamRole" RENAME TO "TeamRole_old";
ALTER TYPE "public"."TeamRole_new" RENAME TO "TeamRole";
DROP TYPE "public"."TeamRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "gender" DROP NOT NULL;
