import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateModuleReport } from "../../../dto/moduleReport.type";
import { ModuleReport } from "@prisma/client";

export class CreateModuleReportCommand extends Command<NestResponse<ModuleReport>> {
  constructor(public readonly data: ICreateModuleReport) {
    super();
  }
}
