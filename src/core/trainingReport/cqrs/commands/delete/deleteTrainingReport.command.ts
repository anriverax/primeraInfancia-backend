import { NestResponse } from "@/common/helpers/types";
import { IDeleteTrainingReport } from "@/core/trainingReport/dto/trainingReport.type";
import { Command } from "@nestjs/cqrs";

export class DeleteTrainingReportCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteTrainingReport) {
    super();
  }
}
