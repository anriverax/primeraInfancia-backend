import { NestResponse } from "@/common/helpers/types";
import { IDeleteEvaluationInstrument } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";
import { Command } from "@nestjs/cqrs";

export class DeleteEvaluationInstrumentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteEvaluationInstrument) {
    super();
  }
}
