import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateTrainingReport } from "../../../dto/trainingReport.type";
import { TrainingReport } from "@prisma/client";

export class CreateTrainingReportCommand extends Command<NestResponse<TrainingReport>> {
  constructor(public readonly data: ICreateTrainingReport) {
    super();
  }
}
