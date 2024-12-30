-- CreateTable
CREATE TABLE "public"."CandidateStageHistory" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "fromStageId" INTEGER,
    "toStageId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "CandidateStageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CandidateStageHistoryToPipelineStage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "CandidateStageHistory_candidateId_idx" ON "public"."CandidateStageHistory"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateStageHistoryToPipelineStage_AB_unique" ON "public"."_CandidateStageHistoryToPipelineStage"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateStageHistoryToPipelineStage_B_index" ON "public"."_CandidateStageHistoryToPipelineStage"("B");

-- AddForeignKey
ALTER TABLE "public"."CandidateStageHistory" ADD CONSTRAINT "CandidateStageHistory_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateStageHistory" ADD CONSTRAINT "CandidateStageHistory_fromStageId_fkey" FOREIGN KEY ("fromStageId") REFERENCES "public"."PipelineStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateStageHistory" ADD CONSTRAINT "CandidateStageHistory_toStageId_fkey" FOREIGN KEY ("toStageId") REFERENCES "public"."PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateStageHistory" ADD CONSTRAINT "CandidateStageHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CandidateStageHistoryToPipelineStage" ADD CONSTRAINT "_CandidateStageHistoryToPipelineStage_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."CandidateStageHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CandidateStageHistoryToPipelineStage" ADD CONSTRAINT "_CandidateStageHistoryToPipelineStage_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PipelineStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
