-- CreateTable
CREATE TABLE "ToDo" (
    "id" SERIAL NOT NULL,
    "todoName" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("id")
);
