import { NestResponse } from "@/common/helpers/types";
import { IDeleteModuleReport } from "@/core/moduleReport/dto/moduleReport.type";
import { Command } from "@nestjs/cqrs";

export class DeleteModuleReportCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteModuleReport) {
    super();
  }
}
