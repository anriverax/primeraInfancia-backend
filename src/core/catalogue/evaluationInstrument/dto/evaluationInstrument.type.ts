import { EvaluationInstrument } from "@prisma/client";

export type IGetAllEvaluationInstrument = Pick<
  EvaluationInstrument,
  "id" | "name" | "periodicity" | "percentage" | "code"
>;
