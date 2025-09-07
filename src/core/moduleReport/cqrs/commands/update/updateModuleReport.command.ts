import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateModuleReport } from "../../../dto/moduleReport.type";

export class UpdateModuleReportCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateModuleReport) {
    super();
  }
}
