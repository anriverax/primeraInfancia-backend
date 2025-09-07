import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateEvaluationInstrument } from "../../../dto/evaluationInstrument.type";
import { EvaluationInstrument } from "@prisma/client";

export class CreateEvaluationInstrumentCommand extends Command<NestResponse<EvaluationInstrument>> {
  constructor(public readonly data: ICreateEvaluationInstrument) {
    super();
  }
}
