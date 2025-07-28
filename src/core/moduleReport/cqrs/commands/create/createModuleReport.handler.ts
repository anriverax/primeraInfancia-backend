import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateModuleReportCommand } from "./createModuleReport.command";
import { ModuleReportProjection } from "../../projections/moduleReport.projection";
import { NestResponse } from "@/common/helpers/dto";
import { ModuleReport } from "@prisma/client";

@CommandHandler(CreateModuleReportCommand)
export class CreateModuleReportHandler implements ICommandHandler<CreateModuleReportCommand> {
  constructor(private readonly moduleReportProjection: ModuleReportProjection) {}
  async execute(command: CreateModuleReportCommand): Promise<NestResponse<ModuleReport>> {
    const { data } = command;

    const res = await this.moduleReportProjection.create(data);

    return {
      statusCode: 201,
      message: "Informe del módulo creado con éxito.",
      data: res
    };
  }
}
