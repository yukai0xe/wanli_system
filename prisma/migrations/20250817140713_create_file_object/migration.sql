-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('行前會');

-- CreateTable
CREATE TABLE "public"."FileObject" (
    "id" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "displayName" TEXT,
    "type" "public"."FileType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileObject_pkey" PRIMARY KEY ("id")
);
