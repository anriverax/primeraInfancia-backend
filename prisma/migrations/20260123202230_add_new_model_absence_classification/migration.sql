-- CreateTable
CREATE TABLE "AbsenceClassification" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AbsenceClassification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbsenceClassification_code_key" ON "AbsenceClassification"("code");

-- CreateIndex
CREATE INDEX "AbsenceClassification_name_idx" ON "AbsenceClassification"("name");
