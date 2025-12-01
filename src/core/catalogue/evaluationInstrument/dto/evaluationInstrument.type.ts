import { EvaluationInstrument } from "prisma/generated/client";

export type IGetAllEvaluationInstrument = Pick<
  EvaluationInstrument,
  "id" | "name" | "periodicity" | "percentage" | "code"
>;
