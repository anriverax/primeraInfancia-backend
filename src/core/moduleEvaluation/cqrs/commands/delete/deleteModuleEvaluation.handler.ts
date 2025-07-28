import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteModuleEvaluationCommand } from "./deleteModuleEvaluation.command";
import { ModuleEvaluationProjection } from "../../projections/moduleEvaluation.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteModuleEvaluationCommand)
export class DeleteModuleEvaluationHandler implements ICommandHandler<DeleteModuleEvaluationCommand> {
  constructor(private readonly moduleEvaluationProjection: ModuleEvaluationProjection) {}
  async execute(command: DeleteModuleEvaluationCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.moduleEvaluationProjection.delete(data);

    return {
      statusCode: 200,
      message: "Evaluación del módulo eliminada con éxito."
    };
  }
}
