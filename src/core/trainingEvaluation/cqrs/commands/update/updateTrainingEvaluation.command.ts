import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateTrainingEvaluation } from "../../../dto/trainingEvaluation.type";

export class UpdateTrainingEvaluationCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateTrainingEvaluation) {
    super();
  }
}
