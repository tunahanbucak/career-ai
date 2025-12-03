/*
  Warnings:

  - Added the required column `filename` to the `CV` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewRole" AS ENUM ('ASSISTANT', 'USER');

-- AlterTable
ALTER TABLE "CV" ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mime" TEXT,
ADD COLUMN     "rawText" TEXT,
ADD COLUMN     "size" INTEGER;

-- CreateTable
CREATE TABLE "CVAnalysis" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT NOT NULL,
    "keywords" TEXT[],
    "suggestion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CVAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewMessage" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "role" "InterviewRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CVAnalysis" ADD CONSTRAINT "CVAnalysis_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewMessage" ADD CONSTRAINT "InterviewMessage_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
