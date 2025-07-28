import { NestResponse } from "@/common/helpers/dto";
import { IDeleteTrainingEvaluation } from "@/core/trainingEvaluation/dto/trainingEvaluation.type";
import { Command } from "@nestjs/cqrs";

export class DeleteTrainingEvaluationCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteTrainingEvaluation) {
    super();
  }
}
