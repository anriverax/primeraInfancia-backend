import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateTrainingReport } from "../../../dto/trainingReport.type";

export class UpdateTrainingReportCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateTrainingReport) {
    super();
  }
}
