import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateEvaluationInstrument } from "../../../dto/evaluationInstrument.type";

export class UpdateEvaluationInstrumentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateEvaluationInstrument) {
    super();
  }
}
