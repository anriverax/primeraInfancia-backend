import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateModuleReportCommand } from "./updateModuleReport.command";
import { ModuleReportProjection } from "../../projections/moduleReport.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateModuleReportCommand)
export class UpdateModuleReportHandler implements ICommandHandler<UpdateModuleReportCommand> {
  constructor(private readonly moduleReportProjection: ModuleReportProjection) {}
  async execute(command: UpdateModuleReportCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.moduleReportProjection.update(data);

    return {
      statusCode: 200,
      message: "Informe del módulo actualizado con éxito."
    };
  }
}
