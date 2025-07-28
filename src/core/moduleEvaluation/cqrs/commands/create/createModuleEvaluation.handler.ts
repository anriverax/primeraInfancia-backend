import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateModuleEvaluationCommand } from "./createModuleEvaluation.command";
import { ModuleEvaluationProjection } from "../../projections/moduleEvaluation.projection";
import { NestResponse } from "@/common/helpers/dto";
import { ModuleEvaluation } from "@prisma/client";

@CommandHandler(CreateModuleEvaluationCommand)
export class CreateModuleEvaluationHandler implements ICommandHandler<CreateModuleEvaluationCommand> {
  constructor(private readonly moduleEvaluationProjection: ModuleEvaluationProjection) {}
  async execute(command: CreateModuleEvaluationCommand): Promise<NestResponse<ModuleEvaluation>> {
    const { data } = command;

    const res = await this.moduleEvaluationProjection.create(data);

    return {
      statusCode: 201,
      message: "Evaluación del módulo creada con éxito.",
      data: res
    };
  }
}
