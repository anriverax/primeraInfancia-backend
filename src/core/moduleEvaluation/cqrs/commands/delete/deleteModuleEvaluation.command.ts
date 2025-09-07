import { NestResponse } from "@/common/helpers/types";
import { IDeleteModuleEvaluation } from "@/core/moduleEvaluation/dto/moduleEvaluation.type";
import { Command } from "@nestjs/cqrs";

export class DeleteModuleEvaluationCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteModuleEvaluation) {
    super();
  }
}
