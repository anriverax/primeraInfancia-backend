import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateTrainingEvaluation } from "../../../dto/trainingEvaluation.type";
import { TrainingEvaluation } from "@prisma/client";

export class CreateTrainingEvaluationCommand extends Command<NestResponse<TrainingEvaluation>> {
  constructor(public readonly data: ICreateTrainingEvaluation) {
    super();
  }
}
