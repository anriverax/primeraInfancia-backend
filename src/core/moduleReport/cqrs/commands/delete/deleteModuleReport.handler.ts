import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteModuleReportCommand } from "./deleteModuleReport.command";
import { ModuleReportProjection } from "../../projections/moduleReport.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteModuleReportCommand)
export class DeleteModuleReportHandler implements ICommandHandler<DeleteModuleReportCommand> {
  constructor(private readonly moduleReportProjection: ModuleReportProjection) {}
  async execute(command: DeleteModuleReportCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.moduleReportProjection.delete(data);

    return {
      statusCode: 200,
      message: "Informe del módulo eliminado con éxito."
    };
  }
}
