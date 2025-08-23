/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PersonalItemList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeamItemList` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Item_id_seq";

-- AlterTable
ALTER TABLE "public"."PersonalItemList" DROP CONSTRAINT "PersonalItemList_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PersonalItemList_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PersonalItemList_id_seq";

-- AlterTable
ALTER TABLE "public"."TeamItemList" DROP CONSTRAINT "TeamItemList_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TeamItemList_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TeamItemList_id_seq";
