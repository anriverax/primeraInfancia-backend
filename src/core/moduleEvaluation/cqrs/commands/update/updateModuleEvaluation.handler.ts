import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateModuleEvaluationCommand } from "./updateModuleEvaluation.command";
import { ModuleEvaluationProjection } from "../../projections/moduleEvaluation.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateModuleEvaluationCommand)
export class UpdateModuleEvaluationHandler implements ICommandHandler<UpdateModuleEvaluationCommand> {
  constructor(private readonly moduleEvaluationProjection: ModuleEvaluationProjection) {}
  async execute(command: UpdateModuleEvaluationCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.moduleEvaluationProjection.update(data);

    return {
      statusCode: 200,
      message: "Evaluación del módulo actualizada con éxito."
    };
  }
}
